import { state, ui } from '../../state/store.js';
import { esc } from '../../lib/utils.js';
import { describeTiming } from '../../logic/tripSummary.js';
import { avatar } from './avatar.js';

const PARTICIPANT_ROUTES = ['join', 'quiz', 'mini', 'details', 'results'];

/** Preview banner shown while viewing as a participant. */
const participantBanner = () =>
  state.role === 'participant' && PARTICIPANT_ROUTES.includes(state.route)
    ? `<div class="banner">👀 Participant view — what your group sees
         <button data-action="exitPreview">Back to Trip Lead</button></div>`
    : '';

const tripMenu = () =>
  ui.tripMenuOpen
    ? `<div class="wrap" style="position:relative">
        <div class="trip-menu">
          <small class="muted" style="padding:6px 12px">Your trips</small>
          <button data-action="openCurrentTrip">${esc(state.trip.name || 'Untitled trip')}
            <small>${esc(describeTiming(state.trip, { short: true }))}</small></button>
          <button disabled style="opacity:.5">Bali with the cousins<small>Just an idea · placeholder</small></button>
          <button disabled style="opacity:.5">Work offsite, Lisbon?<small>Placeholder</small></button>
          <button data-action="startTrip">+ New group trip</button>
        </div>
      </div>`
    : '';

/** Top bar with the wordmark, "Plan your trip" link and "My trips". */
export const header = () => {
  const isLead = state.role === 'lead';
  const you = { name: isLead ? 'Maya' : state.me.name || 'S', color: isLead ? '#DE007B' : '#04C9A6' };
  return `
    ${participantBanner()}
    <header class="top">
      <div class="wrap topin">
        <a class="wm" data-action="goHome"><span>Rome<b>2</b>Rio</span> <span class="feat">roam2gether</span></a>
        <nav class="nav ${state.route === 'plan' ? 'nav-on-plan' : ''}">
          <button class="navlink" data-action="planTrip">Plan your trip</button>
          <button class="btn btn-ghost btn-sm" data-action="toggleTripMenu">My trips</button>
          ${avatar(you, 'sm')}
        </nav>
      </div>
      ${tripMenu()}
    </header>`;
};
