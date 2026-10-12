/**
 * The seeded crew that makes the results dashboard feel alive.
 * "Sam" is the seat the real user fills in when they play the quiz.
 *
 * `answers` are ten 0/1 values (see QUESTION_TRAITS). `reach` is how far the
 * person is willing to travel: 'close' | 'medium' | 'any'.
 */

export const SEED_CREW = [
  {
    id: 'maya',
    name: 'Maya',
    color: '#DE007B',
    reach: 'medium',
    answers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    hope: 'A beach where nobody asks me to open Slack.',
    labels: ['Sun', 'Street food', 'One perfect place'],
  },
  {
    id: 'jordan',
    name: 'Jordan',
    color: '#0B91DB',
    reach: 'any',
    answers: [0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
    hope: 'One day that starts way too early and ends up being the best one.',
    labels: ['Mountains', 'Late nights', 'Accidental 6am trains'],
  },
  {
    id: 'priya',
    name: 'Priya',
    color: '#734286',
    reach: 'medium',
    answers: [0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    hope: 'I want to eat noodles in a humid night market.',
    labels: ['Asia', 'Boutique stays', 'No itinerary'],
  },
  {
    id: 'theo',
    name: 'Theo',
    color: '#E47225',
    reach: 'close',
    answers: [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    hope: 'A hotel with a proper breakfast and a very good bed.',
    labels: ['Food first', 'Close-ish', 'Fancy hotel'],
  },
  {
    id: 'sam',
    name: 'Sam',
    color: '#04C9A6',
    reach: 'medium',
    answers: [0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
    hope: 'A long lunch that quietly becomes dinner.',
    labels: ['Late nights', 'Asia curious', 'Three-stop trips'],
  },
];

export const getSeed = (id) => SEED_CREW.find((person) => person.id === id);

/** Names used when the Trip Lead says there are more than five adults. */
export const EXTRA_NAMES = ['Noor', 'Kai', 'Remy', 'Ines', 'Bo', 'Lou'];

export const AVATAR_COLORS = ['#DE007B', '#0B91DB', '#734286', '#E47225', '#04C9A6', '#2EBAD3'];

/** Stable avatar colour for any name (seeded names keep their own colour). */
export const colorForName = (name = 'x') => {
  const seeded = SEED_CREW.find((person) => person.name === name);
  return seeded ? seeded.color : AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
};
