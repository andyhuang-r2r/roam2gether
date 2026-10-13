/**
 * The signed-in profile in the top bar: a mocked, dummy user (Maya Chen) with
 * an illustrated portrait, an "online" dot and a small account menu.
 */
import { ui } from '../../state/store.js';

export const DUMMY_USER = {
  name: 'Maya Chen',
  email: 'maya.chen@example.com',
  role: 'Trip Lead · Premium member',
};

/** A friendly illustrated portrait (not a real person). */
export const portrait = (size = 36) => `
  <svg class="portrait" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">
    <defs><linearGradient id="pf-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb3d6"/><stop offset="1" stop-color="#9d7bff"/></linearGradient></defs>
    <rect width="64" height="64" fill="url(#pf-bg)"/>
    <path d="M10 64c2-14 12-20 22-20s20 6 22 20z" fill="#2b2a33"/>
    <rect x="27" y="36" width="10" height="10" rx="4" fill="#e9b48f"/>
    <path d="M17 29c0-11 6-18 15-18s15 7 15 18c0 2-1 5-1 7H18c0-2-1-5-1-7z" fill="#3a2a22"/>
    <ellipse cx="32" cy="30" rx="11" ry="13" fill="#f2c4a1"/>
    <path d="M21 27c3-8 9-11 17-9 4 1 6 4 6 9-4-4-8-6-12-6-4 0-8 2-11 6z" fill="#3a2a22"/>
    <circle cx="27.5" cy="31" r="1.4" fill="#2b2a33"/><circle cx="36.5" cy="31" r="1.4" fill="#2b2a33"/>
    <path d="M28 37c2.4 2 5.6 2 8 0" stroke="#b5654a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </svg>`;

/** The round profile button (with an online dot). */
export const profileButton = () => `
  <button class="profile-btn" data-action="toggleProfileMenu" aria-label="Account: ${DUMMY_USER.name}" aria-expanded="${ui.profileMenuOpen}">
    ${portrait(36)}<span class="online-dot"></span>
  </button>`;

/** The dropdown that opens from it. All entries are mocked. */
export const profileMenu = () =>
  ui.profileMenuOpen
    ? `<div class="wrap" style="position:relative">
        <div class="trip-menu profile-menu">
          <div class="profile-card">${portrait(48)}
            <div><b>${DUMMY_USER.name}</b><small>${DUMMY_USER.email}</small><small>${DUMMY_USER.role}</small></div>
          </div>
          <button data-action="openTrips">🧳 My trips</button>
          <button data-action="mockAccount" data-value="Account settings">⚙️ Account settings</button>
          <button data-action="mockAccount" data-value="Notification preferences">🔔 Notification preferences</button>
          <button data-action="mockAccount" data-value="Sign out">↩ Sign out</button>
        </div>
      </div>`
    : '';
