/**
 * Which planner items can be booked, and what the button should say.
 * Free or informal things (a wander, a market stall, a hidden gem) get no button.
 */

const FREE_ACTIVITY = /wander|walk|crawl|highlights|secret|hidden|free/i;
const INFORMAL_FOOD = /market|bakery|food hall|street|hawker|stall/i;

/** Every booking button looks and reads the same. */
export const BOOK_LABEL = 'Book';

/**
 * @param {'stay'|'do'|'eat'|'move'} sectionId
 * @param {{name?:string, tag?:string}} item
 * @returns {string|null} the button label, or null if it isn't bookable
 */
export const bookingLabel = (sectionId, item) => {
  const text = `${item.name ?? ''} ${item.tag ?? ''}`;
  if (sectionId === 'do' && FREE_ACTIVITY.test(text)) return null;
  if (sectionId === 'eat' && INFORMAL_FOOD.test(text)) return null;
  return BOOK_LABEL;
};

/** The one "Book" button, which hands off to Rome2Rio. */
export const bookButton = (label, what) =>
  label
    ? `<button class="btn btn-pink btn-sm" data-action="bookItem" aria-label="Book ${what.replace(/"/g, '&quot;')}">${label}</button>`
    : '';
