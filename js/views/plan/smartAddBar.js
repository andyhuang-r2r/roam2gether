/** "Paste a link, restaurant, event or place…" — the AI scaffolding bar. */
import { ui } from '../../state/store.js';
import { esc } from '../../lib/utils.js';
import { SCAFFOLD_EXAMPLES, SECTION_LABELS } from '../../data/planSections.js';

const loadingCard = () => `
  <div class="scaf"><div class="shimmer"></div><b>roam2gether is scaffolding it…</b>
    <span class="muted" style="font-size:14px">Finding the address, opening hours, travel time and booking info.</span></div>`;

const readyCard = (place) => `
  <div class="scaf ready">
    <div class="ihd"><div style="flex:1">
      <span class="aitag">AI draft</span> ${place.confidence === 'low' ? '<span class="tag" style="font-size:11px">best guess, verify before booking</span>' : ''}
      <h3 style="margin:6px 0 2px;font-size:22px">${esc(place.name)}</h3>
      <div class="muted">${esc(place.tag)} · ${esc(place.meta)}</div>
    </div></div>
    <p style="margin:10px 0">${esc(place.description)}</p>
    <div class="xtra open">
      <span>📍 <b>Location</b> ${esc(place.area)}</span><span>🕒 <b>Hours</b> ${esc(place.hours)}</span>
      <span>🚌 <b>Travel time</b> ${esc(place.travel)}</span><span>🔗 <b>Menu / site</b> ${esc(place.link)}</span>
      <span>🎟️ <b>Booking</b> ${esc(place.booking)}</span>
    </div>
    <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
      <button class="btn btn-pink btn-sm" data-action="addScaffoldedPlace">Add to ${SECTION_LABELS[place.kind]}</button>
      <button class="btn btn-ghost btn-sm" data-action="discardScaffoldedPlace">Discard</button>
    </div>
  </div>`;

export const smartAddBar = (destination) => {
  const scaffold = ui.scaffold;
  const examples = SCAFFOLD_EXAMPLES[destination.id] ?? SCAFFOLD_EXAMPLES.default;
  let result = '';
  if (scaffold?.isLoading) result = loadingCard();
  else if (scaffold?.place) result = readyCard(scaffold.place);
  return `
    <div class="smart">
      <div class="sbarin">
        <span class="aitag">AI</span>
        <input id="smartAddInput" data-input="smartAdd" placeholder="Paste a link, restaurant, event or place…" value="${esc(ui.scaffoldText)}" autocomplete="off">
        <button class="btn btn-pink btn-sm" data-action="scaffoldPlace">Scaffold it</button>
      </div>
      <div class="chips" style="margin-top:10px">
        <span class="muted" style="font-size:13px">Try:</span>
        ${examples.map((example) => `<button class="chip sm" data-action="tryScaffoldExample" data-value="${esc(example)}">${esc(example)}</button>`).join('')}
      </div>
      ${result}
    </div>`;
};
