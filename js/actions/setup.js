/** Trip Lead setup flow: every action edits `state.draft`, then redraws. */
import { state, ui, createInitialMe } from '../state/store.js';
import { clamp, deepClone } from '../lib/utils.js';
import { DAYS_FOR_LENGTH, tripLengthLabel } from '../lib/dates.js';
import { navigate } from '../render.js';
import { showToast } from '../lib/toast.js';
import { DEFAULT_LOCKED_DATES, KID_AGE_BUCKETS, TRIP_TYPE_DEFAULTS } from '../data/tripOptions.js';
import { tripLengthOf } from '../logic/tripSummary.js';
import { commit, copyToClipboard, getDraft, INVITE_URL, maskEmail, numberData, toggleInArray } from './shared.js';

const MIN_ADULTS = 2;
const MAX_ADULTS = 12;
const MAX_KIDS = 6;
const MAX_STEP = 5;

const DEFAULT_KID_AGE = KID_AGE_BUCKETS[2];

/** Edit one of the draft's lists (origins, kids…) and redraw. */
const editDraft = (change) => {
  change(getDraft());
  commit();
};

export const setupActions = {
  setTripType: (el) =>
    editDraft((draft) => {
      draft.type = el.dataset.value;
      Object.assign(draft, TRIP_TYPE_DEFAULTS[draft.type](draft));
    }),
  changeAdults: (el) =>
    editDraft((draft) => {
      draft.adults = clamp(draft.adults + numberData(el), MIN_ADULTS, MAX_ADULTS);
    }),
  setHasKids: (el) =>
    editDraft((draft) => {
      draft.hasKids = el.dataset.value === 'yes';
      if (draft.hasKids && !draft.kidAges.length) draft.kidAges = [DEFAULT_KID_AGE];
      if (!draft.hasKids) draft.kidAges = [];
    }),
  addKid: () => editDraft((draft) => draft.kidAges.length < MAX_KIDS && draft.kidAges.push(DEFAULT_KID_AGE)),
  removeKid: (el) =>
    editDraft((draft) => {
      draft.kidAges.splice(numberData(el, 'index'), 1);
      if (!draft.kidAges.length) draft.hasKids = false;
    }),
  setKidAge: (el) =>
    editDraft((draft) => {
      draft.kidAges[numberData(el, 'index')] = el.dataset.value;
    }),

  setOriginMode: (el) =>
    editDraft((draft) => {
      draft.originMode = el.dataset.value;
      if (draft.originMode === 'multi' && draft.origins.length < 2) draft.origins.push('');
    }),
  pickCity: (el) =>
    editDraft((draft) => {
      draft.origins[numberData(el, 'index')] = el.dataset.value;
    }),
  addOrigin: () => editDraft((draft) => draft.origins.push('')),
  removeOrigin: (el) => editDraft((draft) => draft.origins.splice(numberData(el, 'index'), 1)),

  setTiming: (el) =>
    editDraft((draft) => {
      draft.timing = el.dataset.value;
      if (draft.timing === 'locked' && !draft.dates.start) {
        draft.dates = { ...DEFAULT_LOCKED_DATES };
        ui.calendar = { year: 2027, month: 2 };
      }
    }),
  toggleMonth: (el) => editDraft((draft) => toggleInArray(draft.months, el.dataset.value)),
  toggleSeason: (el) => editDraft((draft) => toggleInArray(draft.seasons, el.dataset.value)),
  changeDays: (el) =>
    editDraft((draft) => {
      draft.days = clamp(draft.days + numberData(el), 2, 21);
      draft.length = tripLengthLabel(draft.days);
    }),
  setDreamWindow: (el) =>
    editDraft((draft) => {
      draft.dreamWindow = el.dataset.value;
    }),
  setTripLength: (el) =>
    editDraft((draft) => {
      draft.length = el.dataset.value;
      draft.days = DAYS_FOR_LENGTH[draft.length];
    }),
  previousMonth() {
    const { calendar } = ui;
    calendar.month -= 1;
    if (calendar.month < 0) Object.assign(calendar, { month: 11, year: calendar.year - 1 });
    commit();
  },
  nextMonth() {
    const { calendar } = ui;
    calendar.month += 1;
    if (calendar.month > 11) Object.assign(calendar, { month: 0, year: calendar.year + 1 });
    commit();
  },
  /** First tap sets the start, second the end; tapping earlier moves the start. */
  pickDate: (el) =>
    editDraft((draft) => {
      const iso = el.dataset.value;
      const { start, end } = draft.dates;
      if (!start || end) draft.dates = { start: iso, end: null };
      else if (iso < start) draft.dates.start = iso;
      else draft.dates.end = iso;
    }),

  setBudget: (el) =>
    editDraft((draft) => {
      draft.budget = el.dataset.value;
    }),
  addNonNegotiable: (el) =>
    editDraft((draft) => {
      const existing = draft.nonNegotiable.replace(/[.\s]+$/, '');
      draft.nonNegotiable = `${existing ? `${existing}; ` : ''}${el.dataset.value}`;
    }),

  nextStep() {
    state.setupStep = Math.min(MAX_STEP, state.setupStep + 1);
    commit({ scrollToTop: true });
  },
  previousStep() {
    if (state.setupStep > 1) {
      state.setupStep -= 1;
      commit({ scrollToTop: true });
    } else navigate('landing');
  },

  /** Save the draft as the trip and reset everything that depended on the old one. */
  createTrip() {
    state.trip = deepClone(getDraft());
    state.trip.length = tripLengthOf(state.trip);
    Object.assign(state, {
      me: createInitialMe(),
      crewReplied: false,
      votes: {},
      lockedShortlist: null,
      lateArrivals: [],
      invitedEmails: [],
      whatIf: 'brief',
      role: 'lead',
    });
    navigate('invite');
    showToast('Trip created. Time to summon the group.');
  },

  copyInviteLink() {
    copyToClipboard(INVITE_URL);
    showToast('Link copied. Paste it in the group chat.');
  },
  sendEmailInvite() {
    const email = document.querySelector('#inviteEmail').value.trim();
    if (!email.includes('@')) return showToast('Add an email first (this one’s visual only).');
    state.invitedEmails.push(maskEmail(email));
    commit();
    return showToast('Invite sent (pretend).');
  },
};
