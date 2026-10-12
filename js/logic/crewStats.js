/**
 * Turn the crew's answers into the numbers and sentences on the dashboard.
 */
import { A, B, Q } from '../data/quiz.js';

/** How many people picked `value` for question `questionIndex`. */
const countAnswers = (people, questionIndex, value) => people.filter((p) => p.answers[questionIndex] === value).length;

/** Aggregate stats for people who have answered. */
export const computeCrewStats = (crew) => {
  const members = crew.filter((p) => p.answers?.length === 10);
  const count = members.length || 1; // avoid dividing by zero
  const pick = (q, v) => countAnswers(members, q, v);

  const reach = { close: 0, medium: 0, any: 0 };
  members.forEach((p) => {
    reach[p.reach || 'medium'] += 1;
  });

  const warmPicks = pick(Q.CLIMATE, A) + pick(Q.BEACH_OR_MOUNTAIN, A); // sun + beach
  const relaxedPicks = pick(Q.MORNINGS, A) + pick(Q.PLANNING, B); // slow mornings + no itinerary

  return {
    members,
    count: members.length,
    warmShare: warmPicks / (2 * count),
    snowCount: pick(Q.CLIMATE, B),
    europeShare: pick(Q.REGION, A) / count,
    relaxedShare: relaxedPicks / (2 * count),
    slowMorningCount: pick(Q.MORNINGS, A),
    lateNightCount: pick(Q.MORNINGS, B),
    cityShare: pick(Q.SETTING, A) / count,
    beachShare: pick(Q.BEACH_OR_MOUNTAIN, A) / count,
    boutiqueShare: pick(Q.STAY_STYLE, A) / count,
    hiddenGemShare: pick(Q.FAMOUS_OR_HIDDEN, B) / count,
    multiBaseCount: pick(Q.BASES, B),
    singleBaseCount: pick(Q.BASES, A),
    reach,
  };
};

/** "sunny, food-first, a little chaotic" */
export const crewHeadline = (stats) => {
  const climate = stats.warmShare >= 0.6 ? 'sunny' : stats.warmShare <= 0.4 ? 'snowy' : 'weather-flexible';
  let pace;
  if (stats.relaxedShare >= 0.4 && stats.relaxedShare <= 0.6) pace = 'a little chaotic';
  else pace = stats.relaxedShare > 0.6 ? 'delightfully slow' : 'fully packed';
  return [climate, 'food-first', pace].join(', ');
};

export const goodNews = (stats) =>
  stats.snowCount === 0 ? 'nobody wants a ski trip.' : `${stats.snowCount} of ${stats.count} are dreaming of snow.`;

export const complicatedNews = (stats) => {
  if (!stats.slowMorningCount) return 'everyone is a night owl, so nobody’s sleeping.';
  const share = stats.slowMorningCount / stats.count;
  const who = share >= 0.35 && share <= 0.65 ? 'about half the group' : `${stats.slowMorningCount} of ${stats.count}`;
  const verb = stats.slowMorningCount === 1 ? 'wants' : 'want';
  const lateVerb = stats.lateNightCount === 1 ? 'is' : 'are';
  return `${who} ${verb} to be asleep by 10pm — and ${stats.lateNightCount} ${lateVerb} just warming up.`;
};

/** Three short labels describing someone's answers (spicy picks first). */
export const personLabels = (answers) => {
  const spicy = [];
  if (answers[Q.MORNINGS] === B) spicy.push('Late nights');
  if (answers[Q.BASES] === B) spicy.push('Three-stop trips');
  if (answers[Q.FAMOUS_OR_HIDDEN] === B) spicy.push('Hidden gems');
  if (answers[Q.PLANNING] === B) spicy.push('No itinerary');
  if (answers[Q.STAY_STYLE] === B) spicy.push('Stays with a story');
  if (answers[Q.SETTING] === B) spicy.push('Wild escapes');
  if (answers[Q.BEACH_OR_MOUNTAIN] === B) spicy.push('Mountains');
  if (answers[Q.CLIMATE] === B) spicy.push('Snow days');

  const base = [
    answers[Q.CLIMATE] === A ? 'Sun' : null,
    answers[Q.FOOD_STYLE] === A ? 'Street food' : 'Long tables',
    answers[Q.REGION] === A ? 'Europe' : 'Asia',
    answers[Q.BASES] === A ? 'One perfect place' : null,
    answers[Q.BEACH_OR_MOUNTAIN] === A ? 'Beach' : null,
  ].filter(Boolean);

  return [...spicy, ...base].slice(0, 3);
};
