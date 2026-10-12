import { state } from '../state/store.js';
import { clamp, esc } from '../lib/utils.js';
import { getFollowUpSteps } from '../logic/followUps.js';
import { header } from './components/header.js';

const choiceTiles = (step, currentValue) => `
  <div class="tiles">
    ${step.options
      .map(
        ([label, emoji]) => `
        <button class="tile ${currentValue === label ? 'on' : ''}" data-action="chooseFollowUp" data-value="${esc(label)}">
          <span class="ic">${emoji}</span><b>${esc(label)}</b>
        </button>`,
      )
      .join('')}
  </div>`;

const textAnswer = (step, currentValue, isLast) => {
  const bindPath = step.id === 'hope' ? 'me.hope' : `me.followUps.${step.id}`;
  return `
    <textarea class="input" id="followUpText" data-bind="${bindPath}" placeholder="${esc(step.placeholder)}">${esc(currentValue || '')}</textarea>
    <div class="chips" style="margin:12px 0 20px">
      ${step.chips.map((chip) => `<button class="chip sm" data-action="useFollowUpChip" data-value="${esc(chip)}">${esc(chip)}</button>`).join('')}
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-ghost" data-action="nextFollowUp" data-value="skip">Skip</button>
      <button class="btn btn-pink" style="flex:1" data-action="nextFollowUp">${isLast ? 'Show me the middle ground ✨' : 'Next →'}</button>
    </div>`;
};

/** One follow-up question at a time. */
export const detailsView = () => {
  const steps = getFollowUpSteps(state.trip);
  const index = clamp(state.me.followUpIndex, 0, steps.length - 1);
  const step = steps[index];
  const isLast = index === steps.length - 1;
  const currentValue = step.id === 'hope' ? state.me.hope : state.me.followUps[step.id];
  return `
    <div class="screen">
      ${header()}
      <div class="det">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <button class="x" data-action="previousFollowUp" style="width:40px;height:40px">←</button>
          <div style="flex:1"><div class="bar"><i style="width:${((index + 1) / steps.length) * 100}%"></i></div></div>
          <span class="muted" style="font:600 13px Inter">${index + 1} of ${steps.length}</span>
        </div>
        <span class="eyebrow">${esc(step.eyebrow)}</span>
        <h1>${esc(step.question)}</h1>
        ${step.type === 'choice' ? choiceTiles(step, currentValue) : textAnswer(step, currentValue, isLast)}
      </div>
    </div>`;
};
