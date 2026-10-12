/**
 * The playful "You are 70% sun-seeking wanderer…" mini-result.
 */
import { A, B, Q } from '../data/quiz.js';

/** Each archetype scores by how many of its signature answers you gave. */
const ARCHETYPES = [
  {
    name: 'sun-seeking wanderer',
    color: '#DE007B',
    signals: (a) => [a[Q.CLIMATE] === A, a[Q.BEACH_OR_MOUNTAIN] === A, a[Q.MORNINGS] === A, a[Q.PLANNING] === B],
  },
  {
    name: 'city snack hunter',
    color: '#1F1E1E',
    signals: (a) => [a[Q.SETTING] === A, a[Q.FOOD_STYLE] === A, a[Q.MORNINGS] === B],
  },
  {
    name: 'suspiciously willing to take a 6am train',
    color: '#734286',
    signals: (a) => [a[Q.PLANNING] === A, a[Q.BASES] === B, a[Q.SETTING] === B],
  },
  {
    name: 'powder-chasing adventurer',
    color: '#0B91DB',
    signals: (a) => [a[Q.CLIMATE] === B, a[Q.BEACH_OR_MOUNTAIN] === B, a[Q.SETTING] === B],
  },
  {
    name: 'secret-spot detective',
    color: '#E47225',
    signals: (a) => [a[Q.FAMOUS_OR_HIDDEN] === B, a[Q.STAY_STYLE] === B, a[Q.PLANNING] === B],
  },
  {
    name: 'long-table romantic',
    color: '#04C9A6',
    signals: (a) => [a[Q.FOOD_STYLE] === B, a[Q.STAY_STYLE] === A, a[Q.FAMOUS_OR_HIDDEN] === A, a[Q.MORNINGS] === A],
  },
  {
    name: 'off-grid daydreamer',
    color: '#2EBAD3',
    signals: (a) => [a[Q.SETTING] === B, a[Q.BEACH_OR_MOUNTAIN] === B, a[Q.PLANNING] === B, a[Q.BASES] === A],
  },
];

const roundToFive = (n) => Math.max(5, Math.round(n / 5) * 5);

/**
 * Top three archetypes with percentages that always add up to 100.
 * @param {number[]} answers ten 0/1 answers
 * @returns {{name:string,color:string,percent:number}[]}
 */
export const pickArchetypes = (answers) => {
  const scored = ARCHETYPES.map((archetype) => {
    const signals = archetype.signals(answers);
    return { ...archetype, score: signals.filter(Boolean).length / signals.length + 0.08 };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const total = scored.reduce((sum, item) => sum + item.score, 0);
  const [first, second] = scored.map((item) => roundToFive((item.score / total) * 100));
  const third = Math.max(5, 100 - first - second);
  const percents = [100 - second - third, second, third]; // first absorbs rounding drift

  return scored.map((item, i) => ({ name: item.name, color: item.color, percent: percents[i] }));
};
