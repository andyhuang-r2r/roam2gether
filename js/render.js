/**
 * Rendering + navigation.
 *
 * Views are plain functions returning HTML strings. `main.js` registers one
 * per route. Calling `render()` re-draws the current route; `navigate()`
 * switches route first.
 */
import { state, saveState } from './state/store.js';
import { ui } from './state/store.js';

export const ROUTES = ['landing', 'setup', 'invite', 'join', 'quiz', 'mini', 'details', 'loading', 'results', 'plan', 'trips'];

const views = {}; // route -> () => html
const afterRenderHooks = {}; // route -> () => void
let modalRenderer = () => '';
let lastRenderedRoute = null;

export const registerViews = (map) => Object.assign(views, map);
export const registerAfterRender = (map) => Object.assign(afterRenderHooks, map);
export const registerModalRenderer = (fn) => {
  modalRenderer = fn;
};

const appEl = () => document.querySelector('#app');

/** Run a view; if it throws, show a readable error screen instead of a blank page. */
const safely = (view) => {
  try {
    return view();
  } catch (error) {
    console.error(`The "${state.route}" screen failed to render`, error);
    return errorScreen(error);
  }
};

const errorScreen = (error) => `
  <div class="wrap" style="padding:64px 0;max-width:640px">
    <span class="eyebrow">Something went wrong</span>
    <h1 style="margin:8px 0 12px">That screen hit a snag.</h1>
    <p class="muted" style="margin-bottom:16px">Your saved trip may be from an older version of the prototype. Resetting usually fixes it.</p>
    <pre style="background:#f4f1ee;padding:14px;border-radius:12px;overflow:auto;font-size:12px;margin-bottom:20px">${String(
      error?.stack ?? error,
    )
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')}</pre>
    <button class="btn btn-pink" data-action="resetPrototype">Reset prototype</button>
    <button class="btn btn-ghost" data-action="goHome" style="margin-left:8px">Back to the start</button>
  </div>`;

/**
 * Redraw the current screen.
 * @param {{scrollToTop?: boolean}} [options]
 */
export const render = ({ scrollToTop = false } = {}) => {
  // The planner needs a logged-in user; anyone else starts from the landing page.
  if (state.route === 'plan' && !state.user) state.route = 'landing';

  const view = views[state.route] ?? views.landing;
  appEl().innerHTML = safely(view);

  const sameRoute = lastRenderedRoute === state.route;
  if (scrollToTop || !sameRoute) window.scrollTo(0, 0);
  lastRenderedRoute = state.route;

  // Entrance animation only plays when the route changes (not on every click).
  if (sameRoute && state.route !== 'details') {
    appEl()
      .querySelectorAll('.screen')
      .forEach((el) => el.classList.remove('screen'));
  }
  try {
    afterRenderHooks[state.route]?.();
  } catch (error) {
    console.error(`After-render hook for "${state.route}" failed`, error);
  }
};

/** Re-render unless the user is typing (so we don't steal focus). */
export const renderUnlessTyping = () => {
  const active = document.activeElement;
  if (active && /INPUT|TEXTAREA/.test(active.tagName)) return;
  render();
};

/** Go to another screen. */
export const navigate = (route) => {
  state.route = route;
  saveState();
  if (window.location.hash !== `#/${route}`) window.location.hash = `/${route}`;
  render({ scrollToTop: true });
};

/* ---------- modals ---------- */

export const renderModal = () => {
  const el = document.querySelector('#modal');
  const html = ui.modal ? modalRenderer(ui.modal) : '';
  el.innerHTML = html;
  el.classList.toggle('open', Boolean(html));
  document.body.style.overflow = html ? 'hidden' : '';
};

export const openModal = (modal) => {
  ui.modal = modal;
  renderModal();
};

export const closeModal = () => {
  ui.modal = null;
  renderModal();
};
