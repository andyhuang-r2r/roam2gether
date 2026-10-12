/**
 * The "Plan your trip" flow: login gate, entering the planner, and every
 * edit inside it (items, votes, price alerts, AI scaffolding, itinerary).
 */
import { state, ui, saveState } from '../state/store.js';
import { closeModal, navigate, openModal, render, renderModal } from '../render.js';
import { showToast } from '../lib/toast.js';
import { DESTINATIONS, getDestination } from '../data/destinations.js';
import { MONTHS, scaffoldPlace } from '../data/planContent.js';
import { getCrew } from '../logic/crew.js';
import { buildContext, rankDestinations } from '../logic/scoring.js';
import {
  buildItinerary,
  currentDestination,
  currentPlan,
  currentUserName,
  ensurePlan,
  logActivity,
  makeItem,
  newItemId,
  suggestionsFor,
} from '../logic/planner.js';
import { planShareLink } from '../views/plan/shareModal.js';
import { commit, copyToClipboard, maskEmail, numberData, toggleInArray } from './shared.js';

const SCAFFOLD_DELAY_MS = 1100;
const ITINERARY_DELAY_MS = 1300;
const ALERT_STEP_MIN = 50;

/** The destination to plan when none was chosen: the crew's top pick. */
const topDestinationId = () => rankDestinations(getCrew(), buildContext())[0]?.destination.id ?? DESTINATIONS[0].id;

/** Create the plan if needed and show the planner page. */
const enterPlanner = (destinationId) => {
  const destination = getDestination(destinationId);
  state.planDestinationId = destination.id;
  ensurePlan(destination);
  Object.assign(ui, {
    planAnimate: true,
    planTab: 'when',
    activityOpen: false,
    scaffold: null,
    scaffoldText: '',
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
  selectPlanTab(el) {
    ui.planTab = el.dataset.value;
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
  togglePriceAlert() {
    editPlan((plan) => {
      plan.priceAlert.enabled = !plan.priceAlert.enabled;
    });
    showToast(currentPlan().priceAlert.enabled ? 'Price alert on. We’ll ping you when it drops.' : 'Price alert off.');
  },
  changeAlertThreshold: (el) =>
    editPlan((plan) => {
      plan.priceAlert.threshold = Math.max(ALERT_STEP_MIN, plan.priceAlert.threshold + numberData(el));
    }),
  toggleAlertChannel(el) {
    const channel = el.dataset.value;
    editPlan((plan) => {
      const { channels } = plan.priceAlert;
      if (!channels.includes(channel) || channels.length > 1) toggleInArray(channels, channel); // keep at least one
    });
    // App notifications need the Rome2Rio app — point the user to it.
    if (channel === 'app' && currentPlan().priceAlert.channels.includes('app')) openModal({ type: 'appDownload' });
  },
  openAppStore() {
    showToast('Opens the App Store (mocked in this prototype).');
    closeModal();
  },
  toggleSimulatedDrop() {
    editPlan((plan) => {
      plan.priceAlert.simulatedDrop = !plan.priceAlert.simulatedDrop;
    });
    const { priceAlert } = currentPlan();
    if (priceAlert.simulatedDrop)
      showToast(priceAlert.enabled ? '🔔 Price alert triggered!' : 'Price dropped — turn on an alert to get notified.');
  },

  /* ---------- AI: scaffold a pasted place ---------- */
  tryScaffoldExample(el) {
    ui.scaffoldText = el.dataset.value;
    planActions.scaffoldPlace();
  },
  scaffoldPlace() {
    const pasted = (document.querySelector('#smartAddInput')?.value || ui.scaffoldText).trim();
    if (!pasted) return showToast('Paste a link or type a place first.');
    ui.scaffoldText = pasted;
    ui.scaffold = { isLoading: true };
    render();
    const destinationId = state.planDestinationId;
    return setTimeout(() => {
      if (!stillOnPlanner(destinationId)) return;
      ui.scaffold = { place: scaffoldPlace(pasted) };
      render();
    }, SCAFFOLD_DELAY_MS);
  },
  addScaffoldedPlace() {
    const { place } = ui.scaffold;
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
    Object.assign(ui, { scaffold: null, scaffoldText: '' });
    commit();
    showToast(existing ? 'Already on the plan — details added.' : 'Added to the plan.');
  },
  discardScaffoldedPlace() {
    ui.scaffold = null;
    render();
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
      ui.planTab = 'days';
      logActivity(plan, 'roam2gether', 'built a day-by-day plan');
      commit();
    }, ITINERARY_DELAY_MS);
  },
  removeItinerarySlot: (el) =>
    editPlan((plan) => {
      plan.itinerary.days[numberData(el, 'day')].slots.splice(numberData(el, 'index'), 1);
    }),

  /* ---------- sharing ---------- */
  openAd: () => showToast('Opens Rome2Rio search & booking (mocked in this prototype).'),
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
