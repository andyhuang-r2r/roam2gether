/**
 * Who is on this trip and what do we know about them?
 *
 * A "participant" looks like:
 *   { id, name, color, answers, reach, hope, labels,
 *     done, isLead, isMe, isSample, isLate }
 *
 * `done` means they have had their say. People who aren't done have no
 * answers yet and are ignored by the scoring.
 */
import { AVATAR_COLORS, EXTRA_NAMES, getSeed } from '../data/crew.js';
import { state } from '../state/store.js';
import { personLabels } from './crewStats.js';

/** How far someone is willing to travel, from their follow-up answers. */
export const deriveReach = (followUps = {}) => {
  const { travel, mood } = followUps;
  if (travel) {
    if (travel.startsWith('Keep')) return 'close';
    if (travel.startsWith('A medium')) return 'medium';
    return 'any';
  }
  if (mood === 'Need sunshine immediately' || mood === 'Need a break') return 'close';
  if (mood === 'Need an adventure') return 'any';
  return 'medium';
};

/** Everyone on the trip, in display order. */
export const getCrew = () => {
  const { trip, me, crewReplied, lateArrivals } = state;
  const adults = trip.adults;
  const crew = [];

  // 1. The Trip Lead is always in.
  crew.push({ ...getSeed('maya'), done: true, isLead: true, role: 'Trip Lead' });

  // 2. Seeded friends fill the middle seats (everyone except lead and "you").
  ['jordan', 'priya', 'theo']
    .slice(0, Math.max(0, adults - 2))
    .forEach((id) => crew.push({ ...getSeed(id), done: crewReplied }));

  // 3. "You" — real answers once played, otherwise Sam's sample answers.
  const sampleSeat = getSeed('sam');
  if (me.done) {
    crew.push({
      id: 'me',
      name: me.name || 'Sam',
      color: sampleSeat.color,
      answers: me.answers,
      reach: deriveReach(me.followUps),
      hope: me.hope,
      labels: personLabels(me.answers),
      done: true,
      isMe: true,
    });
  } else {
    crew.push({ ...sampleSeat, name: me.name || 'Sam', done: crewReplied, isSample: true, isMe: true });
  }

  // 4. Anyone beyond five adults is invited but hasn't played.
  for (let i = 0; i < Math.max(0, adults - 5); i += 1) {
    crew.push({ id: `extra${i}`, name: EXTRA_NAMES[i] || 'Guest', color: AVATAR_COLORS[(i + 1) % 6], done: false });
  }

  // 5. Late arrivals added by the Trip Lead.
  lateArrivals.forEach((late, i) =>
    crew.push({ id: `late${i}`, name: late.name, color: AVATAR_COLORS[(i + 3) % 6], done: false, isLate: true }),
  );
  return crew;
};

/** Total head-count including late arrivals. */
export const crewSize = () => state.trip.adults + state.lateArrivals.length;

/** Only people who have answered the quiz. */
export const answeredCrew = (crew = getCrew()) => crew.filter((p) => p.done && p.answers?.length === 10);
