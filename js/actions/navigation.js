/** Moving between screens, the header menus, and the demo jump menu. */
import { state, ui, resetState } from '../state/store.js';
import { deepClone } from '../lib/utils.js';
import { navigate, render } from '../render.js';
import { runAction } from '../events.js';
import { showToast } from '../lib/toast.js';

const startSetup = () => {
  state.role = 'lead';
  state.draft = deepClone(state.trip);
  state.setupStep = 1;
  navigate('setup');
};

/** Make sure the seeded crew have "replied" so results have something to show. */
const showResultsAsLead = () => {
  state.role = 'lead';
  state.crewReplied = true;
  state.whatIf = 'brief';
  navigate('loading');
};

export const navigationActions = {
  goHome() {
    state.role = 'lead';
    navigate('landing');
  },
  startTrip() {
    ui.tripMenuOpen = false;
    startSetup();
  },
  /** "My trips" opens the dashboard of every saved trip. */
  openTrips() {
    ui.tripMenuOpen = false;
    ui.profileMenuOpen = false;
    state.role = 'lead';
    navigate('trips');
  },
  openCurrentTrip() {
    ui.tripMenuOpen = false;
    ui.profileMenuOpen = false;
    state.role = 'lead';
    navigate('invite');
  },
  toggleProfileMenu() {
    ui.profileMenuOpen = !ui.profileMenuOpen;
    ui.tripMenuOpen = false;
    render();
  },
  /** Account menu entries are mocked in this prototype. */
  mockAccount(el) {
    ui.profileMenuOpen = false;
    render();
    showToast(`${el.dataset.value} — mocked in this prototype.`);
  },
  toggleTripMenu() {
    ui.profileMenuOpen = false;
    ui.tripMenuOpen = !ui.tripMenuOpen;
    render();
  },
  toggleDemoMenu() {
    ui.demoMenuOpen = !ui.demoMenuOpen;
    render();
  },
  viewFinishedTrip: showResultsAsLead,
  viewGroupResults() {
    state.role = 'lead';
    state.crewReplied = true;
    navigate('loading');
  },
  previewParticipant() {
    state.role = 'participant';
    navigate('join');
  },
  exitPreview() {
    state.role = 'lead';
    navigate('invite');
  },
  playAsYourself() {
    state.role = 'participant';
    delete state.me.generatedQuiz; // the standard ten dilemmas
    Object.assign(state.me, { questionIndex: 0, answers: [], done: false });
    navigate('join');
  },
  backToResults() {
    navigate('results');
  },
  resetPrototype() {
    resetState();
    ui.demoMenuOpen = false;
    ui.tripMenuOpen = false;
    navigate('landing');
  },

  /** Jump from the demo menu to any screen with sensible state. */
  jumpTo(el) {
    ui.demoMenuOpen = false;
    const route = el.dataset.value;
    state.role = ['join', 'quiz'].includes(route) ? 'participant' : 'lead';
    if (route === 'setup') {
      state.draft = deepClone(state.trip);
      state.setupStep = 1;
    }
    if (route === 'quiz') {
      state.me.questionIndex = 0;
      delete state.me.generatedQuiz;
    }
    if (route === 'results') return showResultsAsLead();
    if (route === 'plan') {
      state.crewReplied = true;
      return runAction('planTrip');
    }
    return navigate(route);
  },
};
