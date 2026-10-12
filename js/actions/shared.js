/** Small helpers used by several action modules. */
import { state, saveState } from '../state/store.js';
import { render } from '../render.js';

export const INVITE_URL = 'https://rome2rio.com/roam2gether/j/maya-30th-k7x2';

/** Copy text to the clipboard if the browser allows it (never throws). */
export const copyToClipboard = (text) => {
  try {
    navigator.clipboard?.writeText(text);
  } catch {
    /* clipboard blocked — the toast still tells the user what happened */
  }
};

/** Save, then redraw. Most actions end this way. */
export const commit = ({ scrollToTop = false } = {}) => {
  saveState();
  render({ scrollToTop });
};

/** Add `value` to the array if absent, remove it if present. */
export const toggleInArray = (array, value) => {
  const index = array.indexOf(value);
  if (index >= 0) array.splice(index, 1);
  else array.push(value);
};

/** "maya@example.com" → "m•••@example.com" (the prototype never shows real emails). */
export const maskEmail = (email) => email.replace(/^(.).*(@.*)$/, '$1•••$2');

/** Read a number from an element's data attribute. */
export const numberData = (el, key = 'value') => Number(el.dataset[key]);

/** The draft trip being edited in setup (created on demand). */
export const getDraft = () => {
  if (!state.draft) state.draft = JSON.parse(JSON.stringify(state.trip));
  return state.draft;
};
