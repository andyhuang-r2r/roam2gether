/**
 * "Trip with the cousins" — a second trip that lives alongside the main one.
 * It has its own crew, its own quiz answers, its own destination and its own plan.
 */
import { DEFAULT_TRIP } from './tripOptions.js';
import { deepClone } from '../lib/utils.js';

/** The five cousins who "answered" the quiz; the sixth traveller is you. */
export const COUSIN_CREW = [
  { id: 'kai', name: 'Kai', color: '#0B91DB', reach: 'any', answers: [0, 0, 1, 0, 0, 1, 1, 1, 0, 1], hope: 'Somewhere we can all swim and eat late.' },
  { id: 'noor', name: 'Noor', color: '#E47225', reach: 'medium', answers: [0, 0, 0, 0, 0, 1, 1, 0, 0, 0], hope: 'A trip where nobody is rushed.' },
  { id: 'remy', name: 'Remy', color: '#734286', reach: 'medium', answers: [0, 0, 0, 0, 1, 1, 1, 1, 1, 1], hope: 'One proper adventure we will talk about for years.' },
  { id: 'ines', name: 'Ines', color: '#04C9A6', reach: 'any', answers: [0, 1, 0, 0, 0, 0, 1, 0, 1, 1], hope: 'Good food in every single place.' },
  { id: 'bo', name: 'Bo', color: '#DE007B', reach: 'close', answers: [0, 0, 1, 0, 0, 1, 1, 1, 0, 0], hope: 'Everyone together, no group-chat drama.' },
];

/** Cousins who "join" the plan live once it's open. */
export const COUSIN_TEAMMATES = ['Kai', 'Noor', 'Remy'];

export const createCousinsTrip = () => ({
  ...deepClone(DEFAULT_TRIP),
  name: 'Trip with the cousins',
  adults: 6,
  originMode: 'one',
  origins: ['Melbourne (MEL)'],
  timing: 'dreaming',
  dreamWindow: 'Next year',
  days: 7,
});

export const createCousins = () => ({
  quizDone: false,
  takingQuiz: false,
  answers: [],
  destinationId: null,
  meBackup: null,
  votingStartedAt: null, // when the quiz finished; the cousins' votes arrive over the next ~30s
  vote: null, // the viewer's own vote (a destination id)
  resultSeen: false, // the lead has opened the result and moved on to planning
  trip: createCousinsTrip(),
});
