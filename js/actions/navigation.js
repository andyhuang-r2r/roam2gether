/** Moving between screens, the header menus, and the demo jump menu. */
import { state, ui, resetState } from '../state/store.js';
import { deepClone } from '../lib/utils.js';
import { closeModal, navigate, openModal, render } from '../render.js';
import { runAction } from '../events.js';
import { showToast } from '../lib/toast.js';
import { ensurePlan, setCousinsDestination } from '../logic/planner.js';
import { cousinVoteState } from '../logic/cousinsVote.js';
import { commit } from './shared.js';
import { getDestination } from '../data/destinations.js';

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
    state.activeTrip = 'maya';
    // leaving the cousins quiz (finished or not): put the main trip's answers back
    if (state.cousins.meBackup) state.me = state.cousins.meBackup;
    Object.assign(state.cousins, { takingQuiz: false, meBackup: null });
    ui.tripMenuOpen = false;
    ui.profileMenuOpen = false;
    state.role = 'lead';
    navigate('trips');
  },
  /** The cousins trip has its own page, separate from the main trip. */
  openCousinsTrip() {
    const { cousins } = state;
    // With no destination yet this opens the planner on its own (destination TBD).
    state.user ??= { name: 'Maya', email: 'maya@example.com' };
    state.role = 'lead';
    state.activeTrip = 'cousins';
    ensurePlan(getDestination(cousins.destinationId ?? 'tbd'));
    Object.assign(ui, { planAnimate: true, activityOpen: false, placeDraft: null, placeText: '', placeSection: null });
    navigate('plan');
  },
  /** The cousins' vote page. */
  openCousinsVote() {
    if (!state.cousins.quizDone) return navigate('trips');
    state.role = 'lead';
    state.activeTrip = 'maya';
    navigate('cousinsVote');
  },
  castCousinsVote(el) {
    const { cousins } = state;
    cousins.vote = cousins.vote === el.dataset.value ? null : el.dataset.value;
    commit();
  },
  changeCousinsVote() {
    state.cousins.vote = null;
    commit();
  },
  /** The vote is settled: lock in the winner and go to the plan. */
  planCousinsTrip() {
    const winner = cousinVoteState().winnerId;
    if (!winner) return;
    setCousinsDestination(winner);
    state.cousins.resultSeen = true;
    navigationActions.openCousinsTrip();
  },
  /** Pick a destination yourself for the cousins trip, then open its plan. */
  chooseCousinsDestination(el) {
    setCousinsDestination(el.dataset.value);
    closeModal();
    if (state.route === 'plan' && state.activeTrip === 'cousins') render();
    else navigationActions.openCousinsTrip();
  },
  /** From inside the plan: choose a destination now. */
  pickCousinsDestination() {
    openModal({ type: 'pickDestination' });
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
    state.cousins.takingQuiz = false;
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
      state.cousins.takingQuiz = false;
    }
    if (route === 'results') return showResultsAsLead();
    if (route === 'plan') {
      state.crewReplied = true;
      return runAction('planTrip');
    }
    return navigate(route);
  },
};
