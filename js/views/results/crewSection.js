import { esc } from '../../lib/utils.js';
import { avatar } from '../components/avatar.js';
import { crewSize } from '../../logic/crew.js';

const doneCard = (person) => `
  <div class="pc ${person.isSample ? 'sample' : ''}">
    ${avatar(person, 'lg')}
    <div class="nm">${esc(person.name)}${person.isMe && !person.isSample ? ' <small>(you)</small>' : ''}
      <small>${person.isLead ? '· Trip Lead' : person.isSample ? '· sample answers' : ''}</small></div>
    <div class="chips">${person.labels.map((label) => `<span class="tag">${esc(label)}</span>`).join('')}</div>
    ${person.hope ? `<div class="q">“${esc(person.hope)}”</div>` : ''}
  </div>`;

const waitingCard = (person) => `
  <div class="pc wait">
    ${avatar(person, 'lg')}
    <div class="nm">${esc(person.name)} <small>${person.isLate ? '· late arrival' : ''}</small></div>
    <span class="pill">Still thinking…</span>
    <p class="muted" style="font-size:14px;margin-top:10px">roam2gether will fold them in the moment they play.</p>
  </div>`;

export const crewSection = (crew) => `
  <h2 class="h2">The group</h2>
  <p class="h2sub">${crew.filter((p) => p.done).length} of ${crewSize()} have had their say.</p>
  <div class="people">${crew.map((p) => (p.done ? doneCard(p) : waitingCard(p))).join('')}</div>`;

/** Sticky-note wall of everyone's "secret hope". */
export const secretHopesSection = (crew) => {
  const tilts = [-1.5, 1, -0.5, 1.5, -1];
  const notes = crew
    .filter((p) => p.done && p.hope)
    .map(
      (p, i) =>
        `<div class="note" style="--r:${tilts[i % tilts.length]}deg">“${esc(p.hope)}”<small>— ${esc(p.name)}</small></div>`,
    )
    .join('');
  return `
    <h2 class="h2">Secret hopes</h2>
    <p class="h2sub">The thing each person quietly wants.</p>
    <div class="hopes">${notes}</div>`;
};
