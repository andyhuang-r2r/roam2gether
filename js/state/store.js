/**
 * Application state.
 *
 * `state`  – everything that should survive a refresh (saved to localStorage).
 * `ui`     – transient UI flags (open modal, timers…). Never saved.
 *
 * Both are single mutable objects: change them, then call `render()`.
 */
import { DEFAULT_TRIP } from '../data/tripOptions.js';
import { deepClone } from '../lib/utils.js';
import { createCousins } from '../data/cousins.js';

const STORAGE_KEY = 'roameo.proto.v2';

/** The participant (the person playing the quiz in this browser). */
export const createInitialMe = () => ({
  name: 'Sam',
  answers: [], // ten 0/1 answers
  questionIndex: 0,
  followUpIndex: 0,
  followUps: {}, // { [questionId]: answer }
  hope: '',
  done: false,
});

export const createInitialState = () => ({
  route: 'landing',
  role: 'lead', // 'lead' | 'participant'
  setupStep: 1,
  trip: deepClone(DEFAULT_TRIP), // the created trip
  draft: null, // trip being edited in the setup flow
  me: createInitialMe(),
  crewReplied: false, // seeded group have "answered"
  lateArrivals: [], // [{ name }]
  invitedEmails: [], // masked emails
  lockedShortlist: null, // destination ids the Trip Lead limited the vote to
  votes: {}, // { [personId]: destinationId } — real votes only
  whatIf: 'brief', // 'brief' | 'locked' | 'dreaming'
  user: { name: 'Maya', email: 'maya.chen@example.com' }, // always signed in (mocked); the app never asks for a login
  plans: {}, // planner state keyed by destination id
  planDestinationId: null,
  activeTrip: 'maya', // which trip the planner is showing: 'maya' | 'cousins'
  cousins: createCousins(), // the second trip (its own crew, quiz answers, destination and plan)
});

const loadState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.version === 2) {
      const merged = { ...createInitialState(), ...saved.state };
      merged.user ??= createInitialState().user; // older saves from before the always-signed-in change
      return merged;
    }
  } catch {
    /* storage unavailable or corrupt — start fresh */
  }
  return createInitialState();
};

export const state = loadState();

export const saveState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, state }));
  } catch {
    /* private mode etc. — the prototype still works without persistence */
  }
};

/** Replace the whole state in place (other modules hold a reference to it). */
export const resetState = () => {
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, createInitialState());
  saveState();
};

export const ui = {
  modal: null, // { type, ... } – see views/modals.js
  calendar: { year: 2027, month: 2 }, // month shown in the date picker (0-based)
  demoMenuOpen: false,
  tripMenuOpen: false,
  profileMenuOpen: false,
  isPickingAnswer: false, // blocks double taps while the quiz animates
  loadingTimer: null,
  placeSection: null, // which section's "Plan for me" bar is in use
  activityOpen: false, // activity slide-out in the planner
  planAnimate: true, // play the entrance animation on the planner
  placeDraft: null, // { isLoading: true } or { place } for the "fill in details" bar
  placeText: '',
  isBuildingItinerary: false,
};
