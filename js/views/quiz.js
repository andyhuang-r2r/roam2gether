import { state } from '../state/store.js';
import { esc } from '../lib/utils.js';
import { QUIZ_QUESTIONS, QUESTION_COUNT } from '../data/quiz.js';
import { renderScene } from '../scenes/index.js';

/** One big tappable option (A or B). */
const optionCard = (value, option, currentAnswer) => `
  <button class="qcard ${currentAnswer === value ? 'prev' : ''}" data-action="pickAnswer" data-value="${value}" aria-label="${esc(option.label)}">
    ${renderScene(option.scene)}
    <div class="ov"></div>
    <span class="ck">✓</span>
    <div class="lb"><b>${esc(option.label)}</b><small>${esc(option.sub)}</small></div>
  </button>`;

/** Progress as ten small segments: done / current / upcoming. */
const progressSegments = (current) =>
  QUIZ_QUESTIONS.map((_, i) => `<i class="${i < current ? 'd' : i === current ? 'c' : ''}"></i>`).join('');

export const quizView = () => {
  const index = state.me.questionIndex;
  const generated = state.me.generatedQuiz;
  const question = (generated?.questions ?? QUIZ_QUESTIONS)[index];
  const currentAnswer = state.me.answers[index];
  return `
    <div class="quiz screen">
      <div class="qtop">
        ${generated ? '<span class="qai">✨ Written for your group</span>' : ''}
        <div class="qrow">
          <button class="round" data-action="previousQuestion" aria-label="Back">←</button>
          <div class="segs">${progressSegments(index)}</div>
          <span class="cnt">${index + 1} of ${QUESTION_COUNT}</span>
        </div>
        <div class="qprompt">${esc(generated?.prompt ?? 'This or that?')}<small>${esc(question.hint)}</small></div>
      </div>
      <div class="qwrap">
        <div class="qcards">
          ${optionCard(0, question.optionA, currentAnswer)}
          ${optionCard(1, question.optionB, currentAnswer)}
          <div class="qor">or</div>
        </div>
      </div>
    </div>`;
};
