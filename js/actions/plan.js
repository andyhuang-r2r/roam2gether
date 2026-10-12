/**
 * The "Plan your trip" flow: login gate, entering the planner, and every
 * edit inside it (items, votes, price alerts, AI place details, itinerary).
 */
import { state, ui, saveState } from '../state/store.js';
import { closeModal, navigate, openModal, render, renderModal } from '../render.js';
import { showToast } from '../lib/toast.js';
import { DESTINATIONS, getDestination } from '../data/destinations.js';
import { MONTHS, draftPlaceFromText } from '../data/planContent.js';
import { getCrew } from '../logic/crew.js';
import { buildContext, rankDestinations } from '../logic/scoring.js';
import {
  buildItinerary,
  currentDestination,
  currentPlan,
  currentUserName,
  ensurePlan,
  isAlertOn,
  logActivity,
  makeItem,
  newItemId,
  suggestionsFor,
} from '../logic/planner.js';
import { alertBannerHtml } from '../views/plan/flightsSection.js';
import { planShareLink } from '../views/plan/shareModal.js';
import { commit, copyToClipboard, maskEmail, numberData, toggleInArray } from './shared.js';

const DRAFT_DELAY_MS = 1100;
const ITINERARY_DELAY_MS = 1300;

/** The destination to plan when none was chosen: the crew's top pick. */
const topDestinationId = () => rankDestinations(getCrew(), buildContext())[0]?.destination.id ?? DESTINATIONS[0].id;

/** Create the plan if needed and show the planner page. */
const enterPlanner = (destinationId) => {
  const destination = getDestination(destinationId);
  state.planDestinationId = destination.id;
  ensurePlan(destination);
  Object.assign(ui, {
    planAnimate: true,
    activityOpen: false,
    planWidgetOpen: false,
    placeDraft: null,
    placeText: '',
    tripMenuOpen: false,
  });
  state.role = 'lead';
  state.crewReplied = true; // the planner assumes the crew has had their say
  closeModal(); // the routes drawer / login dialog may still be open
  navigate('plan');
};

/** Edit the current plan, then save and redraw. */
const editPlan = (change) => {
  change(currentPlan(), currentDestination());
  commit();
};

/** Ignore timers that fire after the user has left the planner. */
const stillOnPlanner = (destinationId) => state.route === 'plan' && state.planDestinationId === destinationId;

const ROME2RIO_URL = 'https://www.rome2rio.com/';
const openRome2Rio = () => window.open(ROME2RIO_URL, '_blank', 'noopener');

export const planActions = {
  /** Every "Plan your trip" button lands here. Login first, then the planner. */
  planTrip(el) {
    const destinationId = el?.dataset?.value || state.planDestinationId || topDestinationId();
    if (!state.user) return openModal({ type: 'login', destinationId });
    return enterPlanner(destinationId);
  },
  logIn(el) {
    const destinationId = ui.modal?.destinationId;
    const name = document.querySelector('#loginName')?.value.trim() || 'Maya';
    const email = document.querySelector('#loginEmail')?.value || 'maya@example.com';
    state.user = { name: el.dataset.value === 'google' ? 'Maya' : name, email };
    saveState();
    showToast(`Welcome, ${state.user.name}. Your plans now live in your account.`);
    enterPlanner(destinationId || state.planDestinationId || topDestinationId());
  },

  /* ---------- layout ---------- */
  /** The floating "Plan for me" button opens a mini version of the bar. */
  openPlanWidget() {
    ui.planWidgetOpen = true;
    render();
    setTimeout(() => document.querySelector('#planWidgetInput')?.focus(), 50);
  },
  closePlanWidget() {
    ui.planWidgetOpen = false;
    render();
  },
  openActivity() {
    ui.activityOpen = true;
    render();
  },
  closeActivity() {
    ui.activityOpen = false;
    render();
  },

  /* ---------- items ---------- */
  addSuggestion(el) {
    editPlan((plan, destination) => {
      const section = el.dataset.section;
      const suggestion = suggestionsFor(section, destination)[numberData(el, 'index')];
      if (!suggestion) return;
      plan.items[section].push(makeItem(section, suggestion, currentUserName()));
      logActivity(plan, currentUserName(), `added “${suggestion.name}”`);
    });
    showToast('Added to the plan.');
  },
  removeItem: (el) =>
    editPlan((plan) => {
      const [removed] = plan.items[el.dataset.section].splice(numberData(el, 'index'), 1);
      if (removed) logActivity(plan, currentUserName(), `removed “${removed.name}”`);
    }),
  toggleVote: (el) =>
    editPlan((plan) => {
      const item = plan.items[el.dataset.section][numberData(el, 'index')];
      if (item) toggleInArray(item.votes, currentUserName());
    }),
  togglePlanMonth: (el) =>
    editPlan((plan) => {
      const month = numberData(el);
      const wasShortlisted = plan.shortlistedMonths.includes(month);
      toggleInArray(plan.shortlistedMonths, month);
      logActivity(plan, currentUserName(), `${wasShortlisted ? 'removed' : 'shortlisted'} ${MONTHS[month]}`);
    }),

  /* ---------- flight price alert ---------- */
  /** One tap turns an alert channel on or off — no separate on/off switch. */
  toggleAlertChannel(el) {
    const channel = el.dataset.value;
    editPlan((plan) => toggleInArray(plan.priceAlert.channels, channel));
    const isOn = currentPlan().priceAlert.channels.includes(channel);
    if (channel === 'app' && isOn) return openModal({ type: 'appDownload' }); // app alerts need the Rome2Rio app
    if (!isOn) return showToast('Alert turned off.');
    return showToast(channel === 'email' ? `Alert on — we’ll email ${state.user?.email ?? 'you'}.` : 'Alert on.');
  },
  /** The price slider: update the number and banner live without redrawing (keeps the drag smooth). */
  setAlertThreshold(el) {
    const plan = currentPlan();
    plan.priceAlert.threshold = Number(el.value);
    saveState();
    const label = document.querySelector('#alertValue');
    if (label) label.textContent = Number(el.value).toLocaleString('en-US');
    const slot = document.querySelector('#alertBannerSlot');
    if (slot) slot.innerHTML = alertBannerHtml(plan, currentDestination());
  },
  openAppStore() {
    showToast('Opens the App Store (mocked in this prototype).');
    closeModal();
  },
  /** Demo menu: pretend the fare just dropped, so the alert can be shown off. */
  toggleSimulatedDrop() {
    ui.demoMenuOpen = false;
    editPlan((plan) => {
      plan.priceAlert.simulatedDrop = !plan.priceAlert.simulatedDrop;
    });
    const plan = currentPlan();
    if (plan.priceAlert.simulatedDrop) {
      showToast(isAlertOn(plan) ? '🔔 Price alert triggered!' : 'Price dropped — turn on an alert to get notified.');
    }
  },

  /* ---------- AI: fill in the details of a pasted place ---------- */
  tryPlaceExample(el) {
    ui.placeText = el.dataset.value;
    planActions.fillPlaceDetails();
  },
  fillPlaceDetails(el) {
    const input = el?.closest?.('.add-place-row')?.querySelector('input');
    const pasted = (input?.value ?? ui.placeText).trim();
    if (!pasted) return showToast('Paste a link or type a place first.');
    ui.placeText = pasted;
    ui.placeDraft = { isLoading: true };
    render();
    const destinationId = state.planDestinationId;
    return setTimeout(() => {
      if (!stillOnPlanner(destinationId)) return;
      ui.placeDraft = { place: draftPlaceFromText(pasted) };
      render();
    }, DRAFT_DELAY_MS);
  },
  addDraftedPlace() {
    const { place } = ui.placeDraft;
    const details = {
      area: place.area,
      hours: place.hours,
      travel: place.travel,
      link: place.link,
      booking: place.booking,
    };
    const plan = currentPlan();
    const existing = plan.items[place.kind].find((item) => item.name === place.name);
    if (existing) {
      existing.details = details;
      logActivity(plan, currentUserName(), `filled in details for “${place.name}”`);
    } else {
      plan.items[place.kind].push({
        id: newItemId(place.kind),
        name: place.name,
        tag: place.tag,
        meta: place.meta,
        area: place.kind === 'stay' ? place.area : undefined,
        description: place.description,
        addedBy: currentUserName(),
        votes: [currentUserName()],
        details,
      });
      logActivity(plan, currentUserName(), `added “${place.name}” with AI`);
    }
    Object.assign(ui, { placeDraft: null, placeText: '', planWidgetOpen: false });
    commit();
    showToast(existing ? 'Already on the plan — details added.' : 'Added to the plan.');
  },

  /* ---------- AI: day by day ---------- */
  buildItinerary() {
    const plan = currentPlan();
    const destination = currentDestination();
    const destinationId = destination.id;
    ui.isBuildingItinerary = true;
    plan.itinerary = null;
    render();
    setTimeout(() => {
      ui.isBuildingItinerary = false;
      if (!stillOnPlanner(destinationId)) return;
      plan.itinerary = buildItinerary(plan, destination);
      logActivity(plan, 'roam2gether', 'built a day-by-day plan');
      commit();
    }, ITINERARY_DELAY_MS);
  },
  removeItinerarySlot: (el) =>
    editPlan((plan) => {
      plan.itinerary.days[numberData(el, 'day')].slots.splice(numberData(el, 'index'), 1);
    }),

  /* ---------- sharing ---------- */
  /** Every booking button (and "See deals" etc.) opens the Rome2Rio home page for now. */
  bookItem: () => openRome2Rio(),
  openAd: () => openRome2Rio(),
  openShare: () => openModal({ type: 'share' }),
  copyPlanLink() {
    copyToClipboard(`https://${planShareLink()}`);
    showToast('Link copied.');
  },
  togglePlanLinkSharing() {
    const plan = currentPlan();
    plan.linkSharing = !plan.linkSharing;
    saveState();
    renderModal();
  },
  invitePlanCollaborator() {
    const email = document.querySelector('#planInviteEmail').value.trim();
    if (!email.includes('@')) return showToast('Add an email first.');
    logActivity(currentPlan(), currentUserName(), `invited ${maskEmail(email)}`);
    saveState();
    closeModal();
    showToast('Invite sent (pretend).');
    return render();
  },
};
