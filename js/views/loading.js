import { esc, initialOf } from '../lib/utils.js';
import { getCrew } from '../logic/crew.js';

export const LOADING_MESSAGES = (crewCount) => [
  `Reading ${crewCount} sets of opinions…`,
  'Negotiating the beach vs mountain situation…',
  'Checking who needs a 9am coffee…',
  'Quietly ignoring the spreadsheet…',
  'Finding the middle ground…',
];

/** "roam2gether is comparing the chaos…" */
export const loadingView = () => {
  const crew = getCrew().slice(0, 6);
  const radius = 115;
  const orbiters = crew
    .map((person, i) => {
      const angle = (i / crew.length) * Math.PI * 2;
      return `<span class="av" style="background:${person.color};transform:translate(${Math.cos(angle) * radius}px,${Math.sin(angle) * radius}px)">${esc(initialOf(person.name))}</span>`;
    })
    .join('');
  return `
    <div class="load screen">
      <div>
        <div class="orbit"><div class="ring2">${orbiters}</div><div class="core">roam2gether</div></div>
        <h1>roam2gether is comparing the chaos…</h1>
        <p id="loadingMessage">${LOADING_MESSAGES(crew.length)[0]}</p>
        <div class="bar" style="max-width:280px;margin:18px auto 0"><i id="loadingBar" style="width:6%"></i></div>
      </div>
    </div>`;
};
