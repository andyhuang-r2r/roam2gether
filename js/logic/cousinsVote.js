/**
 * Voting for the cousins trip. The quiz gives three candidate destinations; each cousin
 * "votes" a little while later (simulated, staggered over ~30 seconds from when the quiz was
 * finished), and the viewer casts their own vote. Everything is derived from timestamps, so
 * leaving the page and coming back finds the votes exactly where they should be.
 */
import { state } from '../state/store.js';
import { COUSIN_CREW } from '../data/cousins.js';
import { personLabels } from './crewStats.js';
import { individualMatchPercent, rankDestinations } from './scoring.js';

/** When each cousin's vote lands, in ms after the quiz is finished (the last one is ~30s). */
export const VOTE_OFFSETS_MS = [7000, 13000, 19000, 25000, 30000];
const CONTEXT = { timing: 'dreaming', budget: 2, regions: ['AU'] };

/** 'new' (no quiz yet) → 'voting' (waiting on votes / the result) → 'decided' (result seen; just plan). */
export const cousinsPhase = () => {
  const { cousins } = state;
  if (cousins.resultSeen) return 'decided';
  if (cousins.quizDone && cousins.votingStartedAt) return 'voting';
  if (cousins.quizDone) return 'decided'; // saved before voting existed
  return 'new';
};

const crewWithYou = () => [
  { id: 'me', name: 'Maya', color: '#DE007B', reach: 'medium', answers: state.cousins.answers, done: true },
  ...COUSIN_CREW.map((cousin) => ({ ...cousin, done: true })),
];

/**
 * The state of the vote right now.
 * @returns {{
 *   candidates: {destination: object, percent: number, voters: object[]}[],
 *   cousins: {id:string,name:string,color:string,voted:boolean,votedFor:string}[],
 *   myVote: string|null, allCousinsIn: boolean, complete: boolean, winnerId: string|null,
 *   waitingOn: number, nextEventMs: number|null
 * }}
 */
/** The cousins plus you, shaped like the main trip's crew so the same results components work. */
export const cousinsCrewList = () =>
  [
    { id: 'me', name: 'Maya', color: '#DE007B', reach: 'medium', answers: state.cousins.answers, hope: 'To see everyone properly relaxed.', isLead: true, isMe: true },
    ...COUSIN_CREW,
  ].map((person) => ({ ...person, done: true, labels: personLabels(person.answers) }));

export const cousinVoteState = (now = Date.now()) => {
  const { cousins } = state;
  const elapsed = now - (cousins.votingStartedAt ?? now);
  const ranked = rankDestinations(crewWithYou(), CONTEXT).slice(0, 3);
  const ids = ranked.map((r) => r.destination.id);

  const cousinStates = COUSIN_CREW.map((cousin, index) => {
    const person = { ...cousin, done: true };
    const votedFor = [...ids].sort(
      (a, b) =>
        individualMatchPercent(person, ranked.find((r) => r.destination.id === b).destination, CONTEXT) -
        individualMatchPercent(person, ranked.find((r) => r.destination.id === a).destination, CONTEXT),
    )[0];
    return { ...cousin, votedFor, voted: elapsed >= VOTE_OFFSETS_MS[index], offset: VOTE_OFFSETS_MS[index] };
  });

  const myVote = ids.includes(cousins.vote) ? cousins.vote : null;
  const candidates = ranked.map((r) => ({
    destination: r.destination,
    percent: r.percent,
    hours: r.hours,
    voters: [
      ...cousinStates.filter((c) => c.voted && c.votedFor === r.destination.id),
      ...(myVote === r.destination.id ? [{ id: 'me', name: 'Maya', color: '#DE007B' }] : []),
    ],
  }));

  const allCousinsIn = cousinStates.every((c) => c.voted);
  const complete = allCousinsIn && Boolean(myVote);
  // most votes wins; ties go to the better match (candidates are already in match order)
  const winnerId = complete
    ? [...candidates].sort((a, b) => b.voters.length - a.voters.length)[0].destination.id
    : null;
  const pending = cousinStates.filter((c) => !c.voted);
  return {
    candidates,
    cousins: cousinStates,
    myVote,
    allCousinsIn,
    complete,
    winnerId,
    waitingOn: pending.length,
    nextEventMs: pending.length ? Math.max(200, Math.min(...pending.map((c) => c.offset)) - elapsed + 50) : null,
  };
};
