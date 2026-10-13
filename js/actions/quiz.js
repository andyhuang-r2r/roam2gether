/** The participant journey: ten dilemmas, then the follow-up questions. */
import { state, ui, saveState } from '../state/store.js';
import { setByPath } from '../lib/utils.js';
import { navigate } from '../render.js';
import { QUESTION_COUNT, QUIZ_QUESTIONS } from '../data/quiz.js';
import { generateQuiz } from '../data/quizVariants.js';
import { getFollowUpSteps } from '../logic/followUps.js';
import { commit, numberData } from './shared.js';

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
      } else navigate('mini');
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
      state.role = 'participant';
      Object.assign(state.me, { questionIndex: 0, answers: [], done: false });
      state.me.generatedQuiz = generateQuiz(QUIZ_QUESTIONS, state.me.generatedQuiz);
      navigate('join');
    }, 1300);
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
