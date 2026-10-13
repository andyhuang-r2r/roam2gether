import { SCENES } from './illustrations.js';
import { QUIZ_SCENES } from './quizScenes.js';

/**
 * SVG illustration for a scene key (falls back to the sun scene).
 * @param {string} key      e.g. 'beach'
 * @param {string} [variant] e.g. 'valencia'
 */
export const renderScene = (key, variant) => (SCENES[key] ?? QUIZ_SCENES[key] ?? SCENES.sun)(variant);
