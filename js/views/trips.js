/**
 * "My trips" — the dashboard of every saved group trip.
 * The current trip is real; the others are mocked so the dashboard has company.
 */
import { state } from '../state/store.js';
import { esc } from '../lib/utils.js';
import { renderScene } from '../scenes/index.js';
import { getDestination } from '../data/destinations.js';
import { describeTiming } from '../logic/tripSummary.js';
import { crewSize, getCrew } from '../logic/crew.js';
import { buildContext, rankDestinations } from '../logic/scoring.js';
import { tallyVotes } from '../logic/voting.js';
import { cousinsPhase, cousinVoteState } from '../logic/cousinsVote.js';
import { CURRENCY_SYMBOL, regionOf } from '../data/cities.js';
import { transportPaths } from '../lib/icons.js';
import { priceHistory } from '../logic/planner.js';
import { flightPrice, flightsFrom, getOrigins } from '../logic/travel.js';
import { header } from './components/header.js';

/** A snapshot of the current return fare for the trip's destination, from the trip's first departure city. */
const fareSnapshot = (destination, trip, plan) => {
  if (!destination || destination.tbd) return '';
  const origin = getOrigins(trip)[0];
  const region = regionOf(origin);
  const price = plan ? priceHistory(destination, region, plan, origin).at(-1) : flightPrice(destination, region, origin);
  return `<div class="tcard-fare"><span class="tfare-ico"><svg viewBox="0 0 24 24">${transportPaths('plane')}</svg></span>
    <span>Flights from <b>${CURRENCY_SYMBOL[region] ?? 'US$'}${Math.round(price).toLocaleString('en-US')}</b> <small>return · ${esc(flightsFrom(destination, region).stops)}</small></span></div>`;
};

const tripCard = ({ destination, name, status, tone, facts, action, fare = '' }) => `
  <article class="tcard">
    <div class="tcard-scene">${destination ? renderScene(destination.scene, destination.sceneVariant) : '<span class="topen">🌍</span>'}<div class="trip-shade"></div>
      <span class="tstatus ${tone}">${esc(status)}</span>
    </div>
    <div class="tcard-body">
      <h3>${esc(name)}</h3>
      <div class="tcard-place">${destination ? `📍 ${esc(destination.name)}` : 'Destination TBD'}</div>
      <div class="tcard-facts">${facts.map((fact) => `<span>${esc(fact)}</span>`).join('')}</div>
      ${fare}
      ${action}
    </div>
  </article>`;

/** The real trip, with a status that follows how far the group has got. */
const currentTrip = () => {
  const plan = state.plans?.[state.planDestinationId];
  // The main trip only shows up once its group has had its say: you took its quiz, saw the results, or started a plan.
  if (!state.me.done && !state.crewReplied && !plan) return '';
  // The destination stays TBD until you've cast your vote (everyone else's votes are in by then).
  const tally = state.crewReplied ? tallyVotes(getCrew(), rankDestinations(getCrew(), buildContext())) : null;
  const winnerId = tally?.viewerVote ? tally.winnerId : null;
  const destinationId = plan ? state.planDestinationId : winnerId;
  const destination = destinationId ? getDestination(destinationId) : null;
  const next = plan
    ? { status: 'Planning', tone: 'plan', action: 'planTrip', label: 'Open plan →' }
    : winnerId
      ? { status: 'Destination chosen', tone: 'ready', action: 'viewGroupResults', label: 'See group results →' }
      : state.crewReplied
        ? { status: 'Voting open', tone: 'wait', action: 'viewGroupResults', label: 'Cast your vote →' }
        : { status: 'Waiting on the group', tone: 'wait', action: 'openCurrentTrip', label: 'Open invite →' };
  return tripCard({
    destination,
    name: state.trip.name || 'Untitled trip',
    status: next.status,
    tone: next.tone,
    fare: fareSnapshot(destination, state.trip, destination ? state.plans?.[destination.id] : null),
    facts: [describeTiming(state.trip, { short: true }), `${crewSize()} travellers`],
    action: `<button class="btn btn-pink btn-sm" data-action="${next.action}"${plan ? ` data-value="${state.planDestinationId}"` : ''}>${next.label}</button>`,
  });
};

const mocked = (label) =>
  `<button class="btn btn-ghost btn-sm" data-action="mockAccount" data-value="${label}">Open →</button>`;

/** A trip with no destination yet lets each member take the 10-question quiz — until they have. */
const quizPrompt = (label = 'Take the quiz →') => `<button class="btn btn-pink btn-sm" data-action="startGeneratedQuiz">${label}</button>`;

/** The cousins trip: open the plan, or take the quiz if you're not sure where to go. */
const cousinsTrip = () => {
  const { cousins } = state;
  const facts = ['Next year', `${cousins.trip.adults} travellers`];
  const base = { name: cousins.trip.name, facts };
  const phase = cousinsPhase();
  if (phase === 'voting') {
    const votes = cousinVoteState();
    return {
      ...base,
      destination: null,
      status: votes.complete ? 'Vote complete' : votes.allCousinsIn ? 'Waiting on your vote' : 'Waiting on the cousins',
      tone: votes.complete ? 'ready' : 'wait',
      action: `<p class="muted tguide">${votes.complete ? 'Everyone has voted. See where the cousins are going.' : 'Destination to be decided. Check the votes to see how it is going.'}</p>
        <div class="tactions"><button class="btn btn-pink btn-sm" data-action="openCousinsVote">Show votes →</button><button class="btn btn-ghost btn-sm" data-action="openCousinsTrip">Open plan →</button></div>`,
    };
  }
  if (phase === 'new') {
    const started = Boolean(state.plans?.['cousins-tbd']);
    return {
      ...base,
      destination: null,
      status: started ? 'Planning · destination TBD' : 'Where to go? We can help',
      tone: started ? 'plan' : 'wait',
      action: `<p class="muted tguide">Open the plan now and choose a place later. Not sure where to go? A short quiz helps the group decide.</p>
        <div class="tactions"><button class="btn btn-ghost btn-sm" data-action="openCousinsTrip">Open plan →</button>${quizPrompt('✨ Not sure? Take the quiz')}</div>`,
    };
  }
  const plan = state.plans?.[`cousins-${cousins.destinationId}`];
  return {
    ...base,
    destination: cousins.destinationId ? getDestination(cousins.destinationId) : null,
    fare: cousins.destinationId ? fareSnapshot(getDestination(cousins.destinationId), cousins.trip, plan) : '',
    status: plan ? 'Planning' : 'Destination chosen',
    tone: plan ? 'plan' : 'ready',
    action: `<div class="tactions"><button class="btn btn-pink btn-sm" data-action="openCousinsTrip">Open plan →</button></div>`,
  };
};

const otherTrips = () =>
  [
    cousinsTrip(),
    {
      destination: getDestination('lisbon'),
      name: 'Work offsite, Lisbon?',
      status: 'Group voting',
      tone: 'ready',
      facts: ['Early March · 4 days', '8 travellers'],
      fare: fareSnapshot(getDestination('lisbon'), { origins: ['Melbourne (MEL)'] }, null),
      action: mocked('Work offsite, Lisbon?'),
    },
    {
      destination: getDestination('valencia'),
      name: 'Valencia long weekend',
      status: 'Completed',
      tone: 'done',
      facts: ['May 2026 · 4 days', '4 travellers'],
      action: mocked('Valencia long weekend'),
    },
  ]
    .map(tripCard)
    .join('');

export const tripsView = () => `
  <div class="screen">
    ${header()}
    <div class="wrap trips">
      <div class="trips-head">
        <div><span class="eyebrow">My trips</span><h1>Your group trips</h1>
          <p class="muted">Everything you’re planning, voting on or dreaming about — all in one place.</p></div>
      </div>
      <div class="tgrid">
        ${currentTrip()}
        ${otherTrips()}
        <button class="tcard tnew" data-action="startTrip"><span class="tplus">+</span><b>Start a new group trip</b>
          <small class="muted">Invite your group, find the place everyone loves</small></button>
      </div>
    </div>
  </div>`;
