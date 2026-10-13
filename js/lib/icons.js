/**
 * Transport icons + brand colours (Rome2Rio transport palette).
 */

export const TRANSPORT_COLORS = {
  plane: '#04C9A6',
  train: '#734286',
  bus: '#E47225',
  ferry: '#2EBAD3',
  hotel: '#0B91DB',
  days: '#DE007B',
};

const TRANSPORT_PATHS = {
  days: '<circle cx="5.5" cy="5.5" r="2.5"/><circle cx="5.5" cy="12" r="2.5"/><circle cx="5.5" cy="18.5" r="2.5"/><rect x="10.5" y="4" width="10" height="3" rx="1.5"/><rect x="10.5" y="10.5" width="10" height="3" rx="1.5"/><rect x="10.5" y="17" width="7" height="3" rx="1.5"/>',
  plane: '<path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0v5l-8 5v2l8-2.5v4.5l-2 1.5V22l3.5-1 3.5 1v-1.5l-2-1.5V13z"/>',
  train:
    '<path d="M12 2C8 2 4 2.5 4 6v9.5A3.5 3.5 0 0 0 7.5 19L6 20.5V21h2.2l2-2h3.6l2 2H18v-.5L16.5 19a3.5 3.5 0 0 0 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM11 10H6V6h5zm2 0V6h5v4zm3.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>',
  bus: '<path d="M4 16c0 .9.4 1.7 1 2.2V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.8c.6-.5 1-1.3 1-2.2V6c0-3.5-3.6-4-8-4S4 2.5 4 6zm3.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM18 11H6V6h12z"/>',
  ferry:
    '<path d="M2.5 15h19L19 20H5z"/><rect x="5.5" y="9" width="13" height="5" rx="1.2"/><rect x="9" y="4.5" width="6" height="3.5" rx="1"/>',
  hotel:
    '<rect x="2.5" y="11" width="19" height="6" rx="1.5"/><rect x="2.5" y="6" width="2.6" height="14" rx="1"/><rect x="6.5" y="8.5" width="6.5" height="3" rx="1.2" opacity=".75"/><rect x="18.9" y="17" width="2.6" height="3" rx="1"/>',
};

/** Raw inner SVG paths (for embedding in other SVGs). */
export const transportPaths = (mode) => TRANSPORT_PATHS[mode] ?? '';

/** A white 24×24 icon for the given transport mode. */
export const transportIcon = (mode) => `<svg viewBox="0 0 24 24" fill="#fff">${TRANSPORT_PATHS[mode] ?? ''}</svg>`;

/**
 * The "AI" sparkle: one large four-point star and two small ones, filled with
 * the gradient defined once in index.html (#ai-gradient).
 */
export const aiStar = (size = 18) =>
  `<svg class="ai-star" viewBox="0 0 24 24" width="${size}" height="${size}" role="img" aria-label="AI"><path d="M10 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z"/><path d="M18.5 14c.3 2.1 1.1 2.9 3.2 3.2-2.1.3-2.9 1.1-3.2 3.2-.3-2.1-1.1-2.9-3.2-3.2 2.1-.3 2.9-1.1 3.2-3.2Z"/><path d="M18 2c.2 1.4.7 1.9 2.1 2.1-1.4.2-1.9.7-2.1 2.1-.2-1.4-.7-1.9-2.1-2.1 1.4-.2 1.9-.7 2.1-2.1Z"/></svg>`;
