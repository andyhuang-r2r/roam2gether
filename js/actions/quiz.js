/** The participant journey: ten dilemmas, then the follow-up questions. */
import { state, ui, saveState } from '../state/store.js';
import { setByPath } from '../lib/utils.js';
import { closeModal, navigate } from '../render.js';
import { QUESTION_COUNT, QUIZ_QUESTIONS } from '../data/quiz.js';
import { generateQuiz } from '../data/quizVariants.js';
import { getFollowUpSteps } from '../logic/followUps.js';
import { deepClone } from '../lib/utils.js';
import { commit, numberData } from './shared.js';

/** The cousins quiz is done: open voting. The cousins' votes arrive over the next ~30s. */
const completeCousinsQuiz = () => {
  const { cousins, me } = state;
  const answers = me.answers.slice(0, 10);
  // a retake: anything already planned for an earlier result becomes the open (TBD) plan again
  if (cousins.destinationId) {
    const old = `cousins-${cousins.destinationId}`;
    if (state.plans[old] && !state.plans['cousins-tbd']) state.plans['cousins-tbd'] = state.plans[old];
    delete state.plans[old];
    cousins.destinationId = null;
  }
  Object.assign(cousins, { quizDone: true, answers, votingStartedAt: Date.now(), vote: null, resultSeen: false });
  if (cousins.meBackup) state.me = cousins.meBackup;
  Object.assign(cousins, { takingQuiz: false, meBackup: null });
  state.role = 'lead';
};

const ANSWER_ANIMATION_MS = 480;
const FOLLOW_UP_ADVANCE_MS = 320;

const currentFollowUp = () => getFollowUpSteps(state.trip)[state.me.followUpIndex];

/** Move to the next follow-up question, or finish and show the results. */
const advanceFollowUp = () => {
  const lastIndex = getFollowUpSteps(state.trip).length - 1;
  if (state.me.followUpIndex < lastIndex) {
    state.me.followUpIndex += 1;
    commit();
    return;
  }
  Object.assign(state.me, { done: true });
  Object.assign(state, { crewReplied: true, role: 'participant', whatIf: 'brief' });
  navigate('loading');
};

export const quizActions = {
  startQuiz() {
    state.me.questionIndex = 0;
    navigate('quiz');
  },

  /** Highlight the tapped card, record the answer, then move on. */
  pickAnswer(el) {
    if (ui.isPickingAnswer) return;
    ui.isPickingAnswer = true;
    const side = numberData(el);
    document.querySelectorAll('.qcard').forEach((card, i) => card.classList.add(i === side ? 'picked' : 'dim'));
    state.me.answers[state.me.questionIndex] = side;
    saveState();
    setTimeout(() => {
      ui.isPickingAnswer = false;
      if (state.me.questionIndex < QUESTION_COUNT - 1) {
        state.me.questionIndex += 1;
        commit();
      } else {
        if (state.cousins.takingQuiz) {
          completeCousinsQuiz();
          navigate('cousinsVote');
        } else navigate('mini');
      }
    }, ANSWER_ANIMATION_MS);
  },
  previousQuestion() {
    if (ui.isPickingAnswer) return;
    if (state.me.questionIndex > 0) {
      state.me.questionIndex -= 1;
      commit();
    } else navigate('join');
  },
  /** The AI-written survey: a fresh set of questions every time it's started. */
  startGeneratedQuiz(el) {
    if (ui.generatingQuiz) return;
    ui.generatingQuiz = true;
    el.innerHTML = '✨ Writing a quiz for your group…';
    el.disabled = true;
    setTimeout(() => {
      ui.generatingQuiz = false;
      closeModal(); // it may have been started from the destination picker
      state.role = 'participant';
      // The cousins quiz is separate from the main trip: set the main trip's answers aside and put them back after.
      if (!state.cousins.takingQuiz) state.cousins.meBackup = deepClone(state.me);
      state.cousins.takingQuiz = true;
      Object.assign(state.me, { questionIndex: 0, answers: [], done: false });
      state.me.generatedQuiz = generateQuiz(QUIZ_QUESTIONS, state.me.generatedQuiz);
      navigate('join');
    }, 1300);
  },
  /** Leave the cousins quiz: put the main trip's answers back and return to the dashboard. */
  finishCousinsQuiz() {
    const { cousins } = state;
    if (cousins.meBackup) state.me = cousins.meBackup;
    Object.assign(cousins, { takingQuiz: false, meBackup: null });
    state.role = 'lead';
    navigate('trips');
  },
  redoQuiz() {
    if (state.me.generatedQuiz) state.me.generatedQuiz = generateQuiz(QUIZ_QUESTIONS, state.me.generatedQuiz);
    state.me.questionIndex = 0;
    navigate('quiz');
  },

  startFollowUps() {
    state.me.followUpIndex = 0;
    navigate('details');
  },
  chooseFollowUp(el) {
    state.me.followUps[currentFollowUp().id] = el.dataset.value;
    saveState();
    document.querySelectorAll('.tile').forEach((tile) => tile.classList.toggle('on', tile === el));
    setTimeout(advanceFollowUp, FOLLOW_UP_ADVANCE_MS);
  },
  useFollowUpChip(el) {
    const step = currentFollowUp();
    setByPath(state, step.id === 'hope' ? 'me.hope' : `me.followUps.${step.id}`, el.dataset.value);
    saveState();
    const textarea = document.querySelector('#followUpText');
    if (textarea) textarea.value = el.dataset.value;
  },
  nextFollowUp(el) {
    if (el.dataset.value === 'skip') {
      const step = currentFollowUp();
      if (step.id === 'hope') state.me.hope = '';
      else delete state.me.followUps[step.id];
      saveState();
    }
    advanceFollowUp();
  },
  previousFollowUp() {
    if (state.me.followUpIndex > 0) {
      state.me.followUpIndex -= 1;
      commit();
    } else navigate('mini');
  },
};
