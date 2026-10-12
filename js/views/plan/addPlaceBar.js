/**
 * "Paste a link, restaurant, event or place…" — roam2gether's AI looks it up,
 * drafts a card with the details, and the user adds it to the plan.
 */
import { ui } from '../../state/store.js';
import { esc } from '../../lib/utils.js';
import { aiStar } from '../../lib/icons.js';
import { PLACE_EXAMPLES, SECTION_LABELS } from '../../data/planSections.js';

const loadingCard = () => `
  <div class="place-draft"><div class="shimmer"></div><b>${aiStar()} Planning it for you…</b>
    <span class="muted" style="font-size:14px">Reading between the lines to find the address, opening hours, travel time and booking info.</span></div>`;

const draftCard = (place) => `
  <div class="place-draft ready">
    <div class="ihd"><div style="flex:1">
      <span class="ai-label">${aiStar(16)} Drafted by AI</span> ${place.confidence === 'low' ? '<span class="tag" style="font-size:11px">best guess, verify before booking</span>' : ''}
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
      <button class="btn btn-pink btn-sm" data-action="addDraftedPlace">Add to ${SECTION_LABELS[place.kind]}</button>
    </div>
  </div>`;

export const addPlaceBar = (destination) => {
  const draft = ui.placeDraft;
  const examples = PLACE_EXAMPLES[destination.id] ?? PLACE_EXAMPLES.default;
  let result = '';
  if (draft?.isLoading) result = loadingCard();
  else if (draft?.place) result = draftCard(draft.place);
  return `
    <div class="add-place" id="addPlaceBar">
      <div class="add-place-row">
        ${aiStar(22)}
        <input id="addPlaceInput" data-input="addPlace" placeholder="Paste a link, restaurant, event or place…" value="${esc(ui.placeText)}" autocomplete="off">
        <button class="btn btn-pink btn-sm" data-action="fillPlaceDetails">${aiStar(16)} Plan for me</button>
      </div>
      <div class="chips" style="margin-top:10px">
        <span class="muted" style="font-size:13px">Try:</span>
        ${examples.map((example) => `<button class="chip sm" data-action="tryPlaceExample" data-value="${esc(example)}">${esc(example)}</button>`).join('')}
      </div>
      ${result}
    </div>`;
};

/**
 * A floating "Plan for me" button, shown once the full bar has scrolled out of view.
 * Clicking it opens a smaller version of the bar (input + results) in its place.
 */
export const addPlaceWidget = () => {
  if (!ui.planWidgetOpen) {
    return `
      <button class="plan-fab pill" id="planFab" data-action="openPlanWidget" aria-label="Plan for me">${aiStar(20)}<span>Plan for me</span></button>`;
  }
  const draft = ui.placeDraft;
  let result = '';
  if (draft?.isLoading) result = loadingCard();
  else if (draft?.place) result = draftCard(draft.place);
  return `
    <div class="plan-fab open" id="planFab">
      <button class="plan-fab-close" data-action="closePlanWidget" aria-label="Close">✕</button>
      ${result}
      <div class="add-place-row">
        ${aiStar(18)}
        <input id="planWidgetInput" data-input="addPlace" placeholder="Paste a link, restaurant, event or place…" value="${esc(ui.placeText)}" autocomplete="off" aria-label="Plan for me">
        <button class="btn btn-pink btn-sm" data-action="fillPlaceDetails">Plan for me</button>
      </div>
    </div>`;
};
