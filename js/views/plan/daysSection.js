import { esc } from '../../lib/utils.js';
import { transportIcon, TRANSPORT_COLORS } from '../../lib/icons.js';
import { ui } from '../../state/store.js';

const SLOT_COLORS = { plane: TRANSPORT_COLORS.plane, stay: TRANSPORT_COLORS.hotel, eat: '#DE007B', do: '#1F1E1E' };
const slotColor = (slot) =>
  slot.kind === 'move'
    ? (TRANSPORT_COLORS[slot.mode] ?? TRANSPORT_COLORS.train)
    : (SLOT_COLORS[slot.kind] ?? '#1F1E1E');

const emptyState = (destination) =>
  destination.tbd
    ? `<div class="empty big"><b>Choose a destination to build your days.</b>
        <p class="muted" style="max-width:460px;margin:6px auto 16px">Once you know where you’re going, roam2gether turns what you’ve added into a day-by-day plan.</p>
        <button class="btn btn-pink" data-action="pickCousinsDestination">Choose a destination</button></div>`
    : ui.isBuildingItinerary
    ? `<div class="empty big"><div class="shimmer"></div><b>roam2gether is stitching your days together…</b>
        <p class="muted">Balancing slow mornings, late nights and one very long lunch.</p></div>`
    : `<div class="empty big"><b>Turn your ideas into a plan.</b>
        <p class="muted" style="max-width:460px;margin:6px auto 16px">roam2gether uses everything you’ve added, fills the gaps, and suggests the transport and stays to book for each step.</p>
        <button class="btn btn-pink" data-action="buildItinerary">✨ Build my day-by-day</button></div>`;

const slotRow = (slot, dayIndex, slotIndex) => `
  <div class="slot">
    <span class="stime">${esc(slot.time)}</span>
    <span class="sdot" style="background:${slotColor(slot)}"></span>
    <div style="flex:1">
      <b>${esc(slot.title)}</b>${slot.source === 'suggested' ? ' <span class="tag" style="font-size:11px;padding:2px 8px">suggested</span>' : ''}
      <div class="muted" style="font-size:13px">${esc(slot.note || '')}</div>
      ${slot.bookable ? `<button class="btn btn-pink btn-sm" data-action="bookItem" aria-label="Book ${esc(slot.bookable)}">Book</button>` : ''}
    </div>
    <button class="x sm" data-action="removeItinerarySlot" data-day="${dayIndex}" data-index="${slotIndex}" aria-label="Remove">×</button>
  </div>`;

const dayCard = (day, dayIndex) => `
  <div class="day">
    <div class="dayh"><b>Day ${day.number}</b><span class="muted">${esc(day.place)}</span></div>
    ${day.slots.map((slot, slotIndex) => slotRow(slot, dayIndex, slotIndex)).join('')}
  </div>`;

export const daysSection = (plan, destination) => {
  if (!plan.itinerary) return emptyState(destination);
  const { days, bookings } = plan.itinerary;
  const addedCount = plan.items.do.length + plan.items.eat.length;
  return `
    <div class="rec">✨ Built from ${addedCount} things you’ve added, plus roam2gether suggestions <span class="tag">suggested</span> where the plan had gaps.
      <button class="link" data-action="buildItinerary">Rebuild</button></div>
    <div class="dgrid2">${days.map(dayCard).join('')}</div>
    <div class="sub">Suggested bookings for this trip</div>
    <div class="chips">
      ${bookings.map((b) => `<button class="bkchip" data-action="openAd"><span class="mico sm2" style="background:${TRANSPORT_COLORS[b.mode]}">${transportIcon(b.mode)}</span>${esc(b.label)}</button>`).join('')}
    </div>`;
};
