import { esc, initialOf } from '../../lib/utils.js';
import { colorForName } from '../../data/crew.js';

/**
 * A round initial avatar.
 * @param {{name:string,color?:string}} person
 * @param {''|'xs'|'sm'|'lg'} [size]
 */
export const avatar = (person, size = '') =>
  `<span class="av ${size}" style="background:${person.color || colorForName(person.name)}" title="${esc(person.name)}">${esc(initialOf(person.name))}</span>`;

/** Avatar from just a name (used by the planner). */
export const avatarFor = (name, size = 'sm') => avatar({ name }, size);

/** Avatar with a ring when the person is active in the planner right now. */
export const presenceAvatar = (name, isActive) =>
  `<span class="av sm ${isActive ? 'active' : 'idle'}" style="background:${colorForName(name)}" title="${esc(name)}${isActive ? ' · active now' : ''}">${esc(initialOf(name))}</span>`;
