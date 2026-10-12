/** Results dashboard: what-if toggle, voting, modals and Trip Lead controls. */
import { state, ui, saveState, createInitialMe } from '../state/store.js';
import { deepClone } from '../lib/utils.js';
import { closeModal, navigate, openModal, renderModal, render } from '../render.js';
import { showToast } from '../lib/toast.js';
import { getCrew } from '../logic/crew.js';
import { buildContext, rankDestinations } from '../logic/scoring.js';
import { viewerId } from '../logic/voting.js';
import { NUDGE_MESSAGE } from '../views/modals.js';
import { commit, copyToClipboard, numberData, toggleInArray } from './shared.js';

const MAX_SHORTLIST = 3;

export const resultsActions = {
  setWhatIf(el) {
    state.whatIf = el.dataset.value;
    commit();
  },

  /* ---------- voting ---------- */
  /** One vote per person: tapping again removes it. */
  castVote(el) {
    const crew = getCrew();
    const voter = viewerId(crew);
    if (state.votes[voter] === el.dataset.value) delete state.votes[voter];
    else state.votes[voter] = el.dataset.value;
    commit();
  },
  /** Take the vote back so it can be changed. */
  changeVote() {
    delete state.votes[viewerId(getCrew())];
    commit();
  },

  openRoutes: (el) => openModal({ type: 'routes', destinationId: el.dataset.value, originIndex: 0 }),
  chooseRouteOrigin(el) {
    ui.modal.originIndex = numberData(el);
    renderModal();
  },
  openCompare: (el) => openModal({ type: 'compare', destinationId: el.dataset.value }),
  closeModal,

  /* nudge */
  openNudge: (el) => openModal({ type: 'nudge', who: el.dataset.value }),
  sendNudge() {
    const { who } = ui.modal;
    closeModal();
    showToast(who ? `Nudge sent to ${who}.` : 'Nudge sent. Fingers crossed.');
  },
  copyNudgeMessage() {
    copyToClipboard(NUDGE_MESSAGE);
    showToast('Copied.');
  },

  /* lock a shortlist */
  openLockShortlist() {
    const preselected = state.lockedShortlist?.length
      ? [...state.lockedShortlist]
      : rankDestinations(getCrew(), buildContext())
          .slice(0, MAX_SHORTLIST)
          .map((r) => r.destination.id);
    openModal({ type: 'lockShortlist', selected: preselected });
  },
  toggleLockChoice(el) {
    const { selected } = ui.modal;
    if (!selected.includes(el.dataset.value) && selected.length >= MAX_SHORTLIST) showToast('Max three.');
    else toggleInArray(selected, el.dataset.value);
    renderModal();
  },
  confirmLockShortlist() {
    state.lockedShortlist = [...ui.modal.selected];
    saveState();
    closeModal();
    showToast('Shortlist locked.');
    if (state.route !== 'results') {
      state.crewReplied = true;
      navigate('results');
    } else render();
  },
  unlockShortlist() {
    state.lockedShortlist = null;
    commit();
  },

  /* start over */
  openStartOver: () => openModal({ type: 'startOver' }),
  confirmStartOver() {
    closeModal();
    Object.assign(state, {
      me: createInitialMe(),
      crewReplied: false,
      votes: {},
      lockedShortlist: null,
      lateArrivals: [],
      invitedEmails: [],
      whatIf: 'brief',
      draft: deepClone(state.trip),
      setupStep: 1,
      role: 'lead',
    });
    navigate('setup');
    showToast('Fresh brief. Clean slate.');
  },

  /* late arrival */
  openLateArrival: () => openModal({ type: 'lateArrival' }),
  confirmLateArrival() {
    const name = document.querySelector('#lateArrivalName').value.trim() || 'Alex';
    state.lateArrivals.push({ name });
    saveState();
    closeModal();
    showToast(`${name} is in. roam2gether will fold them in once they’ve played.`);
    render();
  },
};
