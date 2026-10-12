import { SCENES } from './illustrations.js';

/**
 * SVG illustration for a scene key (falls back to the sun scene).
 * @param {string} key      e.g. 'beach'
 * @param {string} [variant] e.g. 'valencia'
 */
export const renderScene = (key, variant) => (SCENES[key] ?? SCENES.sun)(variant);
