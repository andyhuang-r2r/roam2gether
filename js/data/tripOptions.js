/**
 * Options offered to the Trip Lead during setup, plus the demo trip.
 */

export const TRIP_TYPES = {
  two: { label: 'Just us two', icon: '💑', hint: 'Couples & besties', companionNoun: 'you' },
  friends: { label: 'A few friends', icon: '🍻', hint: '3–6 adults', companionNoun: 'friends' },
  family: { label: 'Family with kids', icon: '👨‍👩‍👧', hint: 'Little legs included', companionNoun: 'family' },
  bigfamily: { label: 'Big family / mixed ages', icon: '🏡', hint: 'Gran to toddler', companionNoun: 'family' },
  work: { label: 'Work crew / other', icon: '💼', hint: 'Colleagues, clubs, cousins', companionNoun: 'teammates' },
};

/** What happens to adults / kids when a group type is picked. */
export const TRIP_TYPE_DEFAULTS = {
  two: (trip) => ({ adults: 2, hasKids: false, kidAges: [] }),
  friends: (trip) => ({ adults: Math.max(3, Math.min(6, trip.adults)), hasKids: false, kidAges: [] }),
  family: () => ({ adults: 2, hasKids: true, kidAges: ['5–8', '9–12'] }),
  bigfamily: () => ({ adults: 6, hasKids: true, kidAges: ['2–4', '9–12', '13–17'] }),
  work: (trip) => ({ adults: Math.max(4, trip.adults), hasKids: false, kidAges: [] }),
};

export const KID_AGE_BUCKETS = ['Under 2', '2–4', '5–8', '9–12', '13–17'];
export const TRIP_LENGTHS = ['Weekend', '4–6 days', 'One week', '10+ days'];
export const DREAM_WINDOWS = ['This year', 'Next year', 'Someday soon'];
export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];

export const BUDGET_LEVELS = [
  { label: 'Stretch it', icon: '🪙', hint: 'Every dollar counts' },
  { label: 'Good value', icon: '👌', hint: 'Smart, not stingy' },
  { label: 'A little fancy', icon: '🥂', hint: 'Nice hotel, nice dinners' },
  { label: 'Treat ourselves', icon: '💎', hint: 'We’ve earned this' },
];

/** 1 (stretch it) … 4 (treat ourselves). */
export const budgetLevel = (label) =>
  Math.max(
    0,
    BUDGET_LEVELS.findIndex((b) => b.label === label),
  ) + 1;

export const NON_NEGOTIABLE_EXAMPLES = ['No overnight flights', 'Easy walking', 'Somewhere with proper food'];

/** The demo trip that every fresh session starts with. */
export const DEFAULT_TRIP = {
  name: "Maya's 30th escape",
  lead: 'Maya',
  type: 'friends',
  adults: 5,
  hasKids: false,
  kidAges: [],
  originMode: 'multi', // 'one' | 'multi'
  origins: ['Melbourne (MEL)', 'Sydney (SYD)'],
  timing: 'dreaming', // 'locked' | 'rough' | 'dreaming'
  dates: { start: null, end: null },
  months: [],
  seasons: [],
  days: 5,
  dreamWindow: 'Next year',
  length: '4–6 days',
  budget: 'Good value',
  nonNegotiable: '',
};

/** Dates pre-filled when the Trip Lead first picks "Dates are locked in". */
export const DEFAULT_LOCKED_DATES = { start: '2027-03-12', end: '2027-03-17' };
