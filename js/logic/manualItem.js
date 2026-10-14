/** Turn the manual "add a booking" form into a plan item. */
import { CURRENCY_SYMBOL, regionOf } from '../data/cities.js';
import { MANUAL_FORMS } from '../data/manualBooking.js';
import { getOrigins } from './travel.js';
import { activeTrip } from './planner.js';

const prettyDate = (iso) => {
  const date = new Date(`${iso}T12:00:00`);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
};

const prettyTime = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h)) return hhmm;
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
};

/** "120" → "A$120 / night". Anything already carrying a symbol or unit is left alone. */
const priceText = (raw, unit) => {
  if (!raw) return '';
  const symbol = CURRENCY_SYMBOL[regionOf(getOrigins(activeTrip())[0])] ?? 'US$';
  const amount = Number(raw);
  if (Number.isNaN(amount)) return raw;
  return `${symbol}${amount.toLocaleString('en-US')}${unit === 'total' ? '' : ` / ${unit}`}`;
};

/**
 * @param {'stay'|'do'|'eat'|'move'} kind
 * @param {Record<string,string>} values trimmed form values by field key
 * @param {string} addedBy
 */
export const itemFromManualForm = (kind, values, addedBy) => {
  const form = MANUAL_FORMS[kind];
  const v = (key) => (values[key] ?? '').trim();
  const dates = v('start') && v('end') ? `${prettyDate(v('start'))} → ${prettyDate(v('end'))}` : v('start') ? prettyDate(v('start')) : '';
  const when = [dates, v('time') && prettyTime(v('time'))].filter(Boolean).join(' · ');
  const route = v('from') || v('to') ? `${v('from') || '…'} → ${v('to') || '…'}` : '';
  const extras = [
    when && `📅 ${when}`,
    route && `🧭 ${route}`,
    kind !== 'stay' && v('location') && `📍 ${v('location')}`, // a stay's area is already in the subtitle
    v('operator') && `🚆 ${v('operator')}`,
    v('duration') && `⏱️ ${v('duration')}`,
    v('guests') && `👥 ${v('guests')} ${kind === 'stay' ? 'guests' : kind === 'eat' ? 'people' : 'travellers'}`,
    v('ref') && `🎟️ Ref ${v('ref')}`,
    v('link') && `🔗 ${v('link')}`,
  ].filter(Boolean);
  return {
    name: v('name'),
    tag: v('tag') || undefined,
    meta: v('location') || route || undefined,
    area: kind === 'stay' ? v('location') || undefined : undefined,
    priceLabel: priceText(v('price'), form.priceUnit),
    description: v('notes'),
    manual: extras,
    addedBy,
    votes: [addedBy],
  };
};
