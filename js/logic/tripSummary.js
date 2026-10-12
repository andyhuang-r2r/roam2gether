/**
 * Plain-English descriptions of a trip, used on cards and summaries.
 */
import { cityName } from '../data/cities.js';
import { DAYS_FOR_LENGTH, countDays, formatDay, tripLengthLabel } from '../lib/dates.js';
import { plural } from '../lib/utils.js';

/** "Locked in · 12 Mar–17 Mar · 6 days" / "Rough window · …" / "Still dreaming · …". */
export const describeTiming = (trip, { short = false } = {}) => {
  if (trip.timing === 'locked') {
    const { start, end } = trip.dates;
    return start && end
      ? `Locked in · ${formatDay(start)}–${formatDay(end)} · ${countDays(start, end)} days`
      : 'Locked in · pick dates';
  }
  if (trip.timing === 'rough') {
    const window = [...trip.months.map((m) => m.slice(0, 3)), ...trip.seasons].join(', ') || 'a rough window';
    return `Rough window · ${window} · ${trip.days} days`;
  }
  return `Still dreaming · ${trip.dreamWindow}${short ? '' : ` · ${trip.length}`}`;
};

/** The trip-length chip label ("4–6 days") however the dates were given. */
export const tripLengthOf = (trip) => {
  if (trip.timing === 'locked' && trip.dates.end) return tripLengthLabel(countDays(trip.dates.start, trip.dates.end));
  if (trip.timing === 'rough') return tripLengthLabel(trip.days);
  return trip.length;
};

/** Number of days the itinerary should cover (3–10). */
export const tripDayCount = (trip) => {
  let days;
  if (trip.timing === 'locked' && trip.dates.end) days = countDays(trip.dates.start, trip.dates.end);
  else if (trip.timing === 'rough') days = trip.days;
  else days = DAYS_FOR_LENGTH[trip.length] ?? 5;
  return Math.min(10, Math.max(3, days));
};

/** "5 adults + 2 kids" */
export const describeCrew = (trip) => {
  const kids = trip.hasKids && trip.kidAges.length ? ` + ${plural(trip.kidAges.length, 'kid')}` : '';
  return `${plural(trip.adults, 'adult')}${kids}`;
};

/** "Melbourne & Sydney" */
export const describeOrigins = (trip) => {
  const cities = trip.origins.filter(Boolean).map(cityName);
  return cities.length ? cities.join(' & ') : 'Somewhere';
};
