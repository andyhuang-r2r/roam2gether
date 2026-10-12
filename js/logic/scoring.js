/**
 * Destination scoring — the curated "AI".
 *
 * Each destination has 0–1 trait scores. Each person's answers pick a trait
 * per question; their fit is the weighted average of those traits. The group
 * score blends the average with the least-happy person ("fairness"), then
 * nudges for travel time, budget, timing and secret hopes.
 *
 * Displayed percentages are anchored: for the seeded demo crew each
 * destination shows its `baselineMatch`, and real scores move from there.
 */
import { DESTINATIONS, FIX_OVERRIDES, GENERIC_FIXES } from '../data/destinations.js';
import { HOPE_KEYWORDS } from '../data/followUps.js';
import { SEED_CREW } from '../data/crew.js';
import { QUESTION_TRAITS, QUESTION_WEIGHTS } from '../data/quiz.js';
import { regionOf } from '../data/cities.js';
import { budgetLevel } from '../data/tripOptions.js';
import { average, clamp } from '../lib/utils.js';
import { state } from '../state/store.js';
import { answeredCrew } from './crew.js';

/** Context used when computing the baseline anchors. */
const DEFAULT_CONTEXT = { timing: 'dreaming', budget: 2, regions: ['AU'] };

/** How the trip + "what if" toggle translate into scoring inputs. */
export const buildContext = () => {
  const { trip, whatIf } = state;
  const regions = [...new Set(trip.origins.filter(Boolean).map(regionOf))];
  return {
    timing: whatIf === 'brief' ? trip.timing : whatIf,
    budget: budgetLevel(trip.budget),
    regions: regions.length ? regions : ['AU'],
  };
};

/** Longest flight from any departure region. */
export const flightHours = (destination, context) =>
  Math.max(...context.regions.map((region) => destination.flights[region].hours));

/** How well one person's answers match one destination (0–1). */
const personFit = (person, destination) => {
  let total = 0;
  let weights = 0;
  QUESTION_WEIGHTS.forEach((weight, question) => {
    const answer = person.answers[question];
    if (answer == null) return;
    total += weight * destination.traits[QUESTION_TRAITS[question][answer]];
    weights += weight;
  });
  return weights ? total / weights : 0;
};

/** People who want to stay close dislike long flights more. */
const travelPenalty = (person, destination, context) => {
  const hours = flightHours(destination, context);
  if (person.reach === 'close') return 0.0045 * Math.max(0, hours - 6);
  if (person.reach === 'medium') return 0.002 * Math.max(0, hours - 12);
  return 0;
};

/** Small boost when someone's secret hope mentions what the place is good at. */
const hopeBoost = (person, destination) =>
  !person.hope
    ? 0
    : HOPE_KEYWORDS.reduce(
        (boost, [pattern, trait, strength]) =>
          pattern.test(person.hope) ? boost + strength * destination.traits[trait] : boost,
        0,
      );

const adjustedFit = (person, destination, context) =>
  personFit(person, destination) - travelPenalty(person, destination, context) + hopeBoost(person, destination);

const groupScore = (destination, people, context) => {
  const fits = people.map((person) => adjustedFit(person, destination, context));
  let score = 0.7 * average(fits) + 0.3 * Math.min(...fits);
  score -= 0.015 * Math.abs(destination.costLevel - context.budget);
  if (context.timing === 'dreaming') score += 0.05 * destination.traits.asia;
  if (context.timing === 'locked' && destination.traits.europe && destination.traits.warm > 0.7) score += 0.05;
  return score;
};

/** Raw scores for the seeded crew — computed once and used as anchors. */
let baselineScores = null;
const getBaselineScores = () => {
  if (!baselineScores) {
    baselineScores = Object.fromEntries(DESTINATIONS.map((d) => [d.id, groupScore(d, SEED_CREW, DEFAULT_CONTEXT)]));
  }
  return baselineScores;
};

/**
 * Rank all destinations for the crew.
 * @returns {{destination, score:number, percent:number, hours:number}[]} best first
 */
export const rankDestinations = (crew, context = buildContext()) => {
  const people = answeredCrew(crew);
  if (!people.length) return [];
  const baselines = getBaselineScores();

  return DESTINATIONS.map((destination) => {
    const score = groupScore(destination, people, context);
    const percent = clamp(Math.round(destination.baselineMatch + (score - baselines[destination.id]) * 140), 30, 98);
    return { destination, score, percent, hours: flightHours(destination, context) };
  }).sort((a, b) => b.percent - a.percent || b.score - a.score);
};

/** One person's match % for a destination (shown in "Compare with the group"). */
export const individualMatchPercent = (person, destination, context = buildContext()) =>
  clamp(Math.round(((adjustedFit(person, destination, context) - 0.25) / 0.65) * 60 + 38), 28, 98);

/** A tip for winning over the person who's least served by this destination. */
export const tipForWinningOver = (person, destination) => {
  let worstQuestion = -1;
  let worstGap = 0;
  person.answers.forEach((answer, question) => {
    const gap = (1 - destination.traits[QUESTION_TRAITS[question][answer]]) * QUESTION_WEIGHTS[question];
    if (gap > worstGap) {
      worstGap = gap;
      worstQuestion = question;
    }
  });
  if (worstQuestion < 0) return '';
  const key = `${worstQuestion}${'ab'[person.answers[worstQuestion]]}`;
  return FIX_OVERRIDES[`${destination.id}:${key}`] ?? GENERIC_FIXES[key];
};
