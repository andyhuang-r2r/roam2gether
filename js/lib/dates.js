/**
 * Date helpers. Dates are stored as ISO strings ("2027-03-12") in state.
 */

export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTH_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Prototype "today" — keeps the calendar deterministic in demos. */
export const TODAY_ISO = '2026-10-13';

/** Build an ISO string from a year, zero-based month and day. */
export const toIso = (year, monthIndex, day) =>
  `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const parseIso = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** "12 Mar" */
export const formatDay = (iso) => {
  const date = parseIso(iso);
  return `${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
};

/** Inclusive number of days between two ISO dates. */
export const countDays = (startIso, endIso) => Math.round((parseIso(endIso) - parseIso(startIso)) / 86_400_000) + 1;

/** Bucket a number of days into the labels used by the trip-length chips. */
export const tripLengthLabel = (days) => {
  if (days <= 3) return 'Weekend';
  if (days <= 6) return '4–6 days';
  if (days <= 9) return 'One week';
  return '10+ days';
};

/** A representative day count for each trip-length chip. */
export const DAYS_FOR_LENGTH = { Weekend: 3, '4–6 days': 5, 'One week': 7, '10+ days': 10 };
