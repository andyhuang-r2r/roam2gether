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
import { header } from './components/header.js';

const tripCard = ({ destination, name, status, tone, facts, action, label }) => `
  <article class="tcard">
    <div class="tcard-scene">${destination ? renderScene(destination.scene, destination.sceneVariant) : '<span class="topen">🌍</span>'}<div class="trip-shade"></div>
      <span class="tstatus ${tone}">${esc(status)}</span>
    </div>
    <div class="tcard-body">
      <h3>${esc(name)}</h3>
      <div class="tcard-place">${destination ? `📍 ${esc(destination.name)}` : 'Destination still open'}</div>
      <div class="tcard-facts">${facts.map((fact) => `<span>${esc(fact)}</span>`).join('')}</div>
      ${action}
    </div>
  </article>`;

/** The real trip, with a status that follows how far the group has got. */
const currentTrip = () => {
  const plan = state.plans?.[state.planDestinationId];
  const topId = rankDestinations(getCrew(), buildContext())[0]?.destination.id;
  const destination = plan || state.crewReplied ? getDestination(state.planDestinationId ?? topId) : null;
  const next = plan
    ? { status: 'Planning', tone: 'plan', action: 'planTrip', label: 'Open plan →' }
    : state.crewReplied
      ? { status: 'Results ready', tone: 'ready', action: 'viewGroupResults', label: 'See group results →' }
      : { status: 'Waiting on the group', tone: 'wait', action: 'openCurrentTrip', label: 'Open invite →' };
  return tripCard({
    destination,
    name: state.trip.name || 'Untitled trip',
    status: next.status,
    tone: next.tone,
    facts: [describeTiming(state.trip, { short: true }), `${crewSize()} travellers`],
    action: `<button class="btn btn-pink btn-sm" data-action="${next.action}"${plan ? ` data-value="${state.planDestinationId}"` : ''}>${next.label}</button>`,
  });
};

const mocked = (label) =>
  `<button class="btn btn-ghost btn-sm" data-action="mockAccount" data-value="${label}">Open →</button>`;

/** A trip with no destination yet lets each member take the 10-question quiz — until they have. */
const quizPrompt = () =>
  state.me.done
    ? '<span class="tquiz-done">✓ You’ve taken the quiz</span>'
    : '<button class="btn btn-pink btn-sm" data-action="startGeneratedQuiz">Take the quiz →</button>';

const otherTrips = () =>
  [
    {
      destination: null,
      name: 'Trip with the cousins',
      status: 'Where to go? Ask the group',
      tone: 'wait',
      facts: ['Next year', '6 travellers'],
      action: `<div class="tactions">${quizPrompt()}<button class="btn btn-ghost btn-sm" data-action="mockAccount" data-value="Inviting the cousins">Invite the cousins</button></div>`,
    },
    {
      destination: getDestination('lisbon'),
      name: 'Work offsite, Lisbon?',
      status: 'Group voting',
      tone: 'ready',
      facts: ['Early March · 4 days', '8 travellers'],
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
        <button class="btn btn-pink" data-action="startTrip">+ New group trip</button>
      </div>
      <div class="tgrid">
        ${currentTrip()}
        ${otherTrips()}
        <button class="tcard tnew" data-action="startTrip"><span class="tplus">+</span><b>Start a new group trip</b>
          <small class="muted">Invite your group, find the place everyone loves</small></button>
      </div>
    </div>
  </div>`;
