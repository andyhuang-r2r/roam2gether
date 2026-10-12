/**
 * Small, dependency-free helpers shared across the app.
 */

/** Escape a value so it is safe to place inside an HTML template. */
export const esc = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );

/** Keep `value` within [min, max]. */
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Arithmetic mean (0 for an empty list). */
export const average = (numbers) => (numbers.length ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length : 0);

/** Plain-JSON deep copy. Fine here because all state is JSON-serialisable. */
export const deepClone = (value) => JSON.parse(JSON.stringify(value));

/** First letter of a name, upper-cased (used for avatars). */
export const initialOf = (name) => (name || '?')[0].toUpperCase();

/**
 * Deterministic pseudo-random generator so illustrations and price charts
 * look the same on every render.
 * @param {number} seed
 * @returns {() => number} function returning numbers in [0, 1)
 */
export const createRng = (seed) => {
  let current = seed;
  return () => {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };
};

/** Turn a string into a stable numeric seed. */
export const seedFromString = (text) => [...text].reduce((total, char) => total + char.charCodeAt(0), 7);

/**
 * Set a nested property using a dotted path, creating objects on the way.
 * Used by `data-bind="plans.lisbon.title"` style inputs.
 */
export const setByPath = (root, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((node, key) => {
    if (node[key] == null) node[key] = {};
    return node[key];
  }, root);
  target[lastKey] = value;
};

/** Pluralise a simple noun: plural(2, 'kid') -> "2 kids". */
export const plural = (count, noun) => `${count} ${noun}${count === 1 ? '' : 's'}`;
