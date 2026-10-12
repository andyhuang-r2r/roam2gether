/**
 * Stay / things to do / places to eat / getting around:
 * "On the plan" cards people vote on, plus suggestion cards to add.
 */
import { aiStar } from '../../lib/icons.js';
import { bookButton, bookingLabel } from '../../logic/booking.js';
import { esc } from '../../lib/utils.js';
import { currentUserName, suggestionsFor } from '../../logic/planner.js';
import { avatarFor } from '../components/avatar.js';

const itemSubtitle = (item) =>
  [item.area || item.meta || '', item.price ? `${item.price}/night` : '', item.rating ? `★ ${item.rating}` : '']
    .filter(Boolean)
    .join(' · ');

/** The extra details roam2gether filled in when a pasted place was drafted by AI. */
const detailLines = (details) => `
  <div class="xtra">
    <span>📍 ${esc(details.area)}</span><span>🕒 ${esc(details.hours)}</span><span>🚌 ${esc(details.travel)}</span>
    <span>🔗 ${esc(details.link)}</span><span>🎟️ ${esc(details.booking)}</span>
  </div>`;

const itemCard = (sectionId, item, index) => {
  const me = currentUserName();
  const hasVoted = item.votes.includes(me);
  const adder = item.addedBy === me ? 'you' : item.addedBy;
  return `
    <div class="icard">
      <div class="ihd">
        <div style="flex:1"><b>${esc(item.name)}</b><div class="muted" style="font-size:13px">${esc(itemSubtitle(item))}</div></div>
        ${item.tag ? `<span class="tag">${esc(item.tag)}</span>` : ''}
      </div>
      ${item.description ? `<p class="idesc">${esc(item.description)}</p>` : ''}
      ${item.details ? detailLines(item.details) : ''}
      <div class="ift">
        <span class="by">${avatarFor(item.addedBy, 'xs')} added by ${esc(adder)}</span>
        <span style="flex:1"></span>
        ${bookButton(bookingLabel(sectionId, item), item.name)}
        <button class="vote ${hasVoted ? 'on' : ''}" data-action="toggleVote" data-section="${sectionId}" data-index="${index}">♥ ${item.votes.length}</button>
        <button class="x sm" data-action="removeItem" data-section="${sectionId}" data-index="${index}" aria-label="Remove">×</button>
      </div>
    </div>`;
};

/** `suggestionIndex` points back into the full suggestion list so "Add" knows which one. */
const suggestionCard = (sectionId, suggestion, suggestionIndex) => `
  <div class="scard">
    <div class="ihd">
      <div style="flex:1"><b>${esc(suggestion.name)}</b><div class="muted" style="font-size:13px">${esc(itemSubtitle(suggestion))}</div></div>
      ${suggestion.tag ? `<span class="tag pink">${esc(suggestion.tag)}</span>` : ''}
    </div>
    <p class="idesc">${esc(suggestion.description || '')}</p>
    <div class="card-actions">
      <button class="btn btn-ghost btn-sm" data-action="addSuggestion" data-section="${sectionId}" data-index="${suggestionIndex}">+ Add to plan</button>
      ${bookButton(bookingLabel(sectionId, suggestion), suggestion.name)}
    </div>
  </div>`;

/** A clearly-labelled mock ad, targeted from the trip. Only for stay / do. */
const adCard = (destination, sectionId) => {
  const city = destination.name.split(' +')[0];
  const copy =
    sectionId === 'stay'
      ? {
          headline: `${city}: stay 4–6 nights from ${destination.costLevel > 2 ? '$$$' : '$$'}`,
          subline: 'Free cancellation on most rooms',
        }
      : { headline: `Skip-the-line tickets in ${city}`, subline: 'Instant confirmation on your phone' };
  return `
    <div class="scard ad">
      <span class="adtag">Ad · based on your trip</span>
      <b>${esc(copy.headline)}</b>
      <p class="idesc">${copy.subline}</p>
      <button class="btn btn-ink btn-sm" data-action="openAd">See deals</button>
    </div>`;
};

export const listSection = (sectionId, plan, destination) => {
  const added = plan.items[sectionId];
  const addedNames = added.map((item) => item.name);
  const suggestions = suggestionsFor(sectionId, destination)
    .map((suggestion, index) => ({ suggestion, index }))
    .filter(({ suggestion }) => !addedNames.includes(suggestion.name));
  const showAd = sectionId === 'stay' || sectionId === 'do';
  return `
    <div class="group confirmed">
      <div class="group-head"><span class="group-badge">✓ On your plan</span><b class="group-count">${added.length}</b>
        <span class="group-hint">Confirmed — the crew can vote on these</span></div>
      ${
        added.length
          ? `<div class="igrid">${added.map((item, i) => itemCard(sectionId, item, i)).join('')}</div>`
          : '<div class="empty">Nothing on the plan yet. Add from the suggestions below, or use Plan for me.</div>'
      }
    </div>
    <div class="group suggested">
      <div class="group-head"><span class="group-badge">${aiStar()} Suggested for you</span>
        <span class="group-hint">Ideas only — add the ones you like</span></div>
      <div class="igrid">
        ${suggestions.map(({ suggestion, index }) => suggestionCard(sectionId, suggestion, index)).join('')}
        ${showAd ? adCard(destination, sectionId) : ''}
      </div>
    </div>`;
};
