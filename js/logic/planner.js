/**
 * Planner logic: creating a plan, price tracking, and the curated
 * "AI" that assembles a day-by-day itinerary.
 *
 * A plan looks like:
 * {
 *   title, shortlistedMonths: number[],
 *   items: { stay: Item[], do: Item[], eat: Item[], move: Item[] },
 *   priceAlert: { threshold, channels: ('email'|'app')[], simulatedDrop } — on when any channel is set,
 *   itinerary: null | { days: Day[], bookings: Booking[] },
 *   activity: { who, text, when }[],
 *   presence: { who }[],    // teammates active right now (shown as a ring on their avatar)
 *   simulationStarted: boolean,
 *   linkSharing: boolean
 * }
 * An Item is { id, name, tag, meta, area?, price?, rating?, description,
 *              addedBy, votes: string[], details? }.
 */
import { state } from '../state/store.js';
import { clamp, createRng, seedFromString } from '../lib/utils.js';
import { parseIso } from '../lib/dates.js';
import { cityName, regionOf } from '../data/cities.js';
import { getDestination } from '../data/destinations.js';
import { AIRPORT_CODES, TRIP_STOPS, getPlanContent, getMoveSuggestions } from '../data/planContent.js';
import { computeCrewStats } from './crewStats.js';
import { getCrew, answeredCrew } from './crew.js';
import { tripDayCount } from './tripSummary.js';
import { flightPrice, getOrigins } from './travel.js';

export const TRIP_LEAD_NAME = 'Maya';
const MAX_ACTIVITY_ENTRIES = 12;
const PRICE_HISTORY_WEEKS = 12;

/** Who is using the planner: the logged-in user, or the Trip Lead by default. */
export const currentUserName = () => state.user?.name || TRIP_LEAD_NAME;

/** A price alert is on as soon as one notification channel is chosen. */
export const isAlertOn = (plan) => plan.priceAlert.channels.length > 0;

export const currentDestination = () => getDestination(state.planDestinationId);

export const currentPlan = () => state.plans[state.planDestinationId];

/* ---------- creating a plan ---------- */

let itemCounter = 0;
export const newItemId = (prefix) => `${prefix}-${Date.now().toString(36)}-${(itemCounter += 1)}`;

/** Build an item the crew can vote on from a suggestion. */
export const makeItem = (sectionId, suggestion, addedBy) => ({
  ...suggestion,
  id: newItemId(sectionId),
  addedBy,
  votes: [addedBy],
});

export const logActivity = (plan, who, text) => {
  plan.activity.unshift({ who, text, when: 'just now' });
  plan.activity = plan.activity.slice(0, MAX_ACTIVITY_ENTRIES);
};

/** A starter price-alert threshold: 10% under the typical fare. */
const defaultAlertThreshold = (destination, trip) => {
  const region = regionOf(getOrigins(trip)[0]);
  return Math.round((flightPrice(destination, region) * 0.9) / 10) * 10;
};

export const createPlan = (destination) => {
  const { trip } = state;
  const content = getPlanContent(destination);
  const lockedStart = trip.timing === 'locked' && trip.dates?.start ? parseIso(trip.dates.start) : null;
  return {
    title: `${destination.name} · ${trip.name || 'Our group trip'}`,
    shortlistedMonths: lockedStart ? [lockedStart.getMonth()] : [],
    items: {
      stay: [makeItem('stay', content.stay[0], TRIP_LEAD_NAME)],
      do: [], // left empty on purpose so the empty state shows
      eat: [makeItem('eat', content.eat[0], TRIP_LEAD_NAME)],
      move: [],
    },
    priceAlert: {
      threshold: defaultAlertThreshold(destination, trip),
      channels: [],
      simulatedDrop: false,
    },
    itinerary: null,
    activity: [{ who: TRIP_LEAD_NAME, text: `started a plan for ${destination.name}`, when: 'just now' }],
    presence: [],
    simulationStarted: false,
    linkSharing: true,
  };
};

/**
 * Make sure a plan exists (and has every field the views read) for the
 * destination. Plans saved by older versions are topped up, never trusted.
 */
export const ensurePlan = (destination) => {
  if (!state.plans || typeof state.plans !== 'object') state.plans = {};
  const saved = state.plans[destination.id];
  if (!saved) {
    state.plans[destination.id] = createPlan(destination);
    return state.plans[destination.id];
  }
  // Fill in anything an older save is missing — in place, so other code
  // holding a reference to the plan keeps seeing the same object.
  const fresh = createPlan(destination);
  Object.keys(fresh).forEach((key) => {
    if (saved[key] == null) saved[key] = fresh[key];
  });
  Object.assign(saved.items, { ...fresh.items, ...saved.items });
  Object.assign(saved.priceAlert, { ...fresh.priceAlert, ...saved.priceAlert });
  // Older saves pre-filled "Things to do" with a sample item; clear it once so the section starts empty.
  if (!saved.clearedSeedDo) {
    const sample = getPlanContent(destination).do[0]?.name;
    saved.items.do = (saved.items.do ?? []).filter(
      (item) => !(item.name === sample && item.addedBy === TRIP_LEAD_NAME && item.votes?.length <= 1),
    );
    saved.clearedSeedDo = true;
  }
  // Older saves had an on/off switch plus channels; now the channels alone say whether the alert is on.
  if ('enabled' in saved.priceAlert) {
    if (!saved.priceAlert.enabled) saved.priceAlert.channels = [];
    delete saved.priceAlert.enabled;
  }
  return saved;
};

/* ---------- price tracking ---------- */

/** 12 weeks of plausible fares, ending at the current price. Deterministic per route. */
export const priceHistory = (destination, region, plan) => {
  const base = flightPrice(destination, region);
  const random = createRng(seedFromString(destination.id + region));
  let price = base * 1.05;
  const history = Array.from({ length: PRICE_HISTORY_WEEKS }, () => {
    price = clamp(price * (1 + (random() - 0.54) * 0.07), base * 0.84, base * 1.2);
    return Math.round(price / 10) * 10;
  });
  if (plan.priceAlert.simulatedDrop) {
    // A visible dip: below the usual range and below the alert price.
    const dip = Math.min(plan.priceAlert.threshold * 0.96, Math.min(...history) * 0.95);
    history[PRICE_HISTORY_WEEKS - 1] = Math.round(dip / 10) * 10;
  }
  return history;
};

/* ---------- AI day-by-day ---------- */

/**
 * Create a day-by-day itinerary. Uses what the crew already added first,
 * then fills gaps with roam2gether's suggestions (marked `source: 'suggested'`).
 */
export const buildItinerary = (plan, destination) => {
  const { trip } = state;
  const dayCount = tripDayCount(trip);
  const content = getPlanContent(destination);
  const stops = TRIP_STOPS[destination.id] ?? [destination.name];
  const airport = AIRPORT_CODES[destination.id] ?? 'the airport';
  const originName = cityName(getOrigins(trip)[0]);
  const isRelaxed = computeCrewStats(answeredCrew(getCrew())).relaxedShare > 0.5;
  const hotel = plan.items.stay[0] ?? content.stay[0];

  /** The nth suggestion for a section: added items first, then unused suggestions. */
  const pickFor = (sectionId, n) => {
    const added = plan.items[sectionId];
    if (added[n]) return { ...added[n], source: 'plan' };
    const addedNames = added.map((item) => item.name);
    const unused = content[sectionId].filter((item) => !addedNames.includes(item.name));
    const choice =
      unused[(n - added.length) % Math.max(1, unused.length)] ?? content[sectionId][n % content[sectionId].length];
    return { ...choice, source: 'suggested' };
  };

  const slot = (time, kind, title, note, extra = {}) => ({ time, kind, title, note, ...extra });
  const mealSlot = (time, meal, note) =>
    slot(time, 'eat', meal.name, note ?? meal.description, { source: meal.source });

  const firstBaseDays = stops.length > 1 && dayCount >= 4 ? Math.ceil(dayCount * 0.6) : dayCount;
  const localRoute = destination.localRoutes[0];
  let activityN = 0;
  let mealN = 0;

  const days = Array.from({ length: dayCount }, (_, i) => {
    const place = i < firstBaseDays ? stops[0] : (stops[1] ?? stops[0]);
    const slots = [];
    if (i === 0) {
      slots.push(
        slot(
          'Arrive',
          'plane',
          `Land in ${stops[0]}`,
          `${originName} → ${airport}. Airport to stay by metro or taxi.`,
          { bookable: 'Airport transfer' },
        ),
      );
      slots.push(slot('15:00', 'stay', `Check in · ${hotel.name}`, hotel.area || 'Drop bags, nap optional'));
      slots.push(mealSlot('19:30', pickFor('eat', mealN++)));
    } else if (i === dayCount - 1) {
      slots.push(mealSlot('09:00', pickFor('eat', mealN++), 'Last proper breakfast'));
      slots.push(slot('11:00', 'stay', 'Check out & final wander', 'Leave bags at the hotel if your flight is late'));
      slots.push(
        slot('Depart', 'plane', `Head home from ${airport}`, 'Allow 2.5h before an international flight', {
          bookable: 'Airport transfer',
        }),
      );
    } else {
      if (i === firstBaseDays && stops[1]) {
        slots.push(
          slot(
            '09:30',
            'move',
            `${stops[0]} → ${stops[1]}`,
            `${localRoute.title} · ${localRoute.duration} · ${localRoute.price}`,
            {
              mode: localRoute.mode,
              bookable: localRoute.mode === 'train' ? 'Train tickets' : 'Local transport',
            },
          ),
        );
      }
      const morning = pickFor('do', activityN++);
      slots.push(
        slot(isRelaxed ? '11:00' : '10:00', 'do', morning.name, morning.description, { source: morning.source }),
      );
      if (!isRelaxed) {
        const afternoon = pickFor('do', activityN++);
        slots.push(slot('15:30', 'do', afternoon.name, afternoon.description, { source: afternoon.source }));
      }
      slots.push(mealSlot('19:30', pickFor('eat', mealN++)));
    }
    return { number: i + 1, place, slots };
  });

  const bookings = [];
  const addBooking = (mode, label) => {
    if (!bookings.some((b) => b.label === label)) bookings.push({ mode, label });
  };
  addBooking('plane', `Flights · ${originName} → ${stops[0]}`);
  addBooking('hotel', `Hotel · ${hotel.name}`);
  addBooking('bus', 'Airport transfer');
  if (stops[1]) addBooking(localRoute.mode, localRoute.title);
  addBooking('bus', 'Rental car for a day trip');

  return { days, bookings };
};

/* ---------- "Getting around" as planner items ---------- */

/** Suggestions for any list section (move is derived from the destination's routes). */
export const suggestionsFor = (sectionId, destination) =>
  sectionId === 'move' ? getMoveSuggestions(destination) : getPlanContent(destination)[sectionId];
