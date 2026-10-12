/**
 * Global event wiring.
 *
 * - Clicks:   any element with `data-action="name"` calls actions[name](el, event).
 * - Inputs:   `data-bind="path.in.state"` writes the value into `state`.
 *             `data-input="name"` routes to a handler registered below.
 * - Keys:     modules can register key handlers with `onKey`.
 *
 * Other values travel on the element: data-value, data-index, data-section…
 */
import { state, ui, saveState } from './state/store.js';
import { setByPath } from './lib/utils.js';
import { ROUTES, render } from './render.js';

const actions = {};
const inputHandlers = {};
const keyHandlers = [];

export const registerActions = (map) => Object.assign(actions, map);
export const registerInputHandlers = (map) => Object.assign(inputHandlers, map);
export const onKey = (handler) => keyHandlers.push(handler);

/** Run an action by name from code (e.g. when one action triggers another). */
export const runAction = (name, el = { dataset: {} }) => actions[name]?.(el);

export const initEvents = () => {
  document.addEventListener('click', (event) => {
    closeTripMenuOnOutsideClick(event);
    const el = event.target.closest('[data-action]');
    const handler = el && actions[el.dataset.action];
    if (handler) {
      event.preventDefault();
      handler(el, event);
    }
  });

  document.addEventListener('input', (event) => {
    const el = event.target;
    if (el.dataset.bind) {
      setByPath(state, el.dataset.bind, el.value);
      saveState();
    }
    inputHandlers[el.dataset.input]?.input?.(el, event);
  });

  document.addEventListener('focusin', (event) => inputHandlers[event.target.dataset?.input]?.focus?.(event.target));
  document.addEventListener('focusout', (event) => inputHandlers[event.target.dataset?.input]?.blur?.(event.target));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') inputHandlers[event.target.dataset?.input]?.enter?.(event.target);
    keyHandlers.forEach((handler) => handler(event));
  });

  window.addEventListener('hashchange', () => {
    const route = window.location.hash.replace('#/', '');
    if (ROUTES.includes(route) && route !== state.route) {
      state.route = route;
      saveState();
      render({ scrollToTop: true });
    }
  });
};

const closeTripMenuOnOutsideClick = (event) => {
  if (!ui.tripMenuOpen) return;
  const insideMenu = event.target.closest('.trip-menu') || event.target.closest('[data-action=toggleTripMenu]');
  if (!insideMenu) {
    ui.tripMenuOpen = false;
    render();
  }
};
