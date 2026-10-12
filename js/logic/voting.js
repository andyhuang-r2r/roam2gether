/**
 * Voting: the crew narrows the destination ideas down to one.
 *
 * - Candidates are the locked shortlist (if the Trip Lead set one) or the
 *   top three matches,
 * - Each person has one vote. The viewer's vote is real (`state.votes`);
 *   crew members who have answered but not voted yet "vote" for the
 *   candidate that suits them best, so the prototype feels alive.
 * - Once the viewer has voted, everyone has voted: the candidate with the
 *   most votes (ties: best match) is selected as the destination.
 */
import { state } from '../state/store.js';
import { answeredCrew } from './crew.js';
import { buildContext, individualMatchPercent } from './scoring.js';

export const MAX_CANDIDATES = 3;

/** The id used for the person looking at the screen. */
export const viewerId = (crew) => {
  if (state.role === 'lead') return 'maya';
  return crew.some((p) => p.id === 'me') ? 'me' : 'sam';
};

/** Destination ids being voted on, best match first. */
export const candidateIds = (ranked) => {
  const pool = state.lockedShortlist?.length
    ? ranked.filter((r) => state.lockedShortlist.includes(r.destination.id))
    : ranked.slice(0, MAX_CANDIDATES);
  return pool.map((r) => r.destination.id);
};

/** Which candidate suits this person best (used for the simulated crew votes). */
const favouriteFor = (person, candidates, context) =>
  candidates
    .map((r) => ({ id: r.destination.id, fit: individualMatchPercent(person, r.destination, context) }))
    .sort((a, b) => b.fit - a.fit)[0]?.id;

/**
 * Work out the current state of the vote.
 * @returns {{
 *   candidates: {result, voters: object[]}[], viewerId: string, viewerVote: string|null,
 *   winnerId: string|null, votesCast: number, voterCount: number
 * }}
 */
export const tallyVotes = (crew, ranked) => {
  const ids = candidateIds(ranked);
  const candidates = ranked.filter((r) => ids.includes(r.destination.id));
  const me = viewerId(crew);
  const context = buildContext();
  const choiceOf = (person) => {
    const explicit = state.votes[person.id];
    if (explicit && ids.includes(explicit)) return explicit;
    return person.id === me ? null : favouriteFor(person, candidates, context);
  };

  const voters = answeredCrew(crew);
  const tallies = candidates.map((result) => ({ result, voters: [] }));
  voters.forEach((person) => {
    const choice = choiceOf(person);
    tallies.find((t) => t.result.destination.id === choice)?.voters.push(person);
  });

  const viewerVote = ids.includes(state.votes[me]) ? state.votes[me] : null;
  const everyoneHasVoted = viewerVote !== null; // the rest of the crew has already voted
  const leader = [...tallies].sort(
    (a, b) => b.voters.length - a.voters.length || b.result.percent - a.result.percent,
  )[0];
  const winnerId = everyoneHasVoted ? (leader?.result.destination.id ?? null) : null;
  return {
    candidates: tallies,
    viewerId: me,
    viewerVote,
    winnerId,
    votesCast: tallies.reduce((sum, t) => sum + t.voters.length, 0),
    voterCount: voters.length,
  };
};

/** Forget everything about the vote (used when the brief changes). */
export const resetVoting = () => {
  state.votes = {};
};
