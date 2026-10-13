import { state } from '../../state/store.js';
import { avatar } from './avatar.js';
import { profileButton, profileMenu } from './profile.js';

const PARTICIPANT_ROUTES = ['join', 'quiz', 'mini', 'details', 'results'];

/** Preview banner shown while viewing as a participant. */
const participantBanner = () =>
  state.role === 'participant' && PARTICIPANT_ROUTES.includes(state.route)
    ? `<div class="banner">👀 Participant view — what your group sees
         <button data-action="exitPreview">Back to Trip Lead</button></div>`
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
        <nav class="nav ${['plan', 'trips'].includes(state.route) ? 'nav-on-plan' : ''}">
          <button class="navlink" data-action="planTrip">Plan your trip</button>
          <button class="btn btn-ghost btn-sm" data-action="openTrips">My trips</button>
          ${isLead ? profileButton() : avatar(you, 'sm')}
        </nav>
      </div>
      ${isLead ? profileMenu() : ''}
    </header>`;
};
