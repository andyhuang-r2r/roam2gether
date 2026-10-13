/**
 * "Paste a link, restaurant, event or place…" — roam2gether's AI looks it up,
 * drafts a card with the details, and the user adds it to the plan.
 */
import { ui } from '../../state/store.js';
import { esc } from '../../lib/utils.js';
import { aiStar } from '../../lib/icons.js';
import { SECTION_LABELS } from '../../data/planSections.js';

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

const PLACEHOLDERS = {
  stay: 'Paste a hotel or stay link, or name a place…',
  do: 'Paste a link or name an activity or attraction…',
  eat: 'Paste a link or name a restaurant or café…',
  move: 'Paste a link or name a pass, transfer or ride…',
};

/** A "Plan for me" bar that lives inside one list section and adds to that section. */
export const sectionPlanBar = (sectionId) => {
  const active = ui.placeSection === sectionId;
  const draft = active ? ui.placeDraft : null;
  let result = '';
  if (draft?.isLoading) result = loadingCard();
  else if (draft?.place) result = draftCard(draft.place);
  return `
    <div class="add-place" data-section="${sectionId}">
      <div class="add-place-row">
        ${aiStar(22)}
        <input data-input="addPlace" data-section="${sectionId}" placeholder="${PLACEHOLDERS[sectionId]}" value="${active ? esc(ui.placeText) : ''}" autocomplete="off" aria-label="Plan for me">
        <button class="btn btn-pink btn-sm" data-action="fillPlaceDetails" data-section="${sectionId}">${aiStar(16)} Plan for me</button>
      </div>
      ${result}
    </div>`;
};
