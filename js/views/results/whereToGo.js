/** "Where to go": the destination cards and the vote that narrows them to one. */
import { state } from '../../state/store.js';
import { esc } from '../../lib/utils.js';
import { tallyVotes } from '../../logic/voting.js';
import { compactDestination, destinationCard } from './destinationCards.js';

const WHAT_IF_OPTIONS = [
  ['brief', 'Your brief'],
  ['locked', 'Dates locked'],
  ['dreaming', 'Still dreaming'],
];

const whatIfToggle = () => `
  <div class="whatif">
    <span class="muted">What if…</span>
    <div class="seg">
      ${WHAT_IF_OPTIONS.map(([key, label]) => `<button class="${state.whatIf === key ? 'on' : ''}" data-action="setWhatIf" data-value="${key}">${label}</button>`).join('')}
    </div>
  </div>`;

const lockedShortlistBanner = (isLead) =>
  state.lockedShortlist?.length
    ? `<div class="lockbox">
         <b style="font-family:Inter">📌 The Trip Lead limited the vote to ${state.lockedShortlist.length} ideas</b>
         ${isLead ? '<div style="margin-top:8px"><button class="btn btn-ghost btn-sm" data-action="unlockShortlist">Unlock shortlist</button></div>' : ''}
       </div>`
    : '';

/** Progress while voting, or the result once everyone has voted. */
const voteStatus = (tally) => {
  const winner = tally.candidates.find((t) => t.result.destination.id === tally.winnerId);
  if (winner) {
    const { destination } = winner.result;
    return `
      <div class="winnerbox">
        <div><span class="eyebrow" style="color:#fff;opacity:.85">Everyone has voted</span>
          <h3 style="margin:4px 0 2px">You are going to ${esc(destination.name)} 🎉</h3>
          <div style="opacity:.9;font-size:14px">${winner.voters.length} of ${tally.voterCount} votes · ${winner.result.percent}% match</div></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-white" data-action="planTrip" data-value="${destination.id}">Plan your trip →</button>
          <button class="btn btn-ghost-light" data-action="changeVote">Change my vote</button>
        </div>
      </div>`;
  }
  return `
    <div class="votehead">
      <div><b style="font-family:Inter">Cast your vote</b>
        <div class="muted" style="font-size:14px">${tally.votesCast} of ${tally.voterCount} votes are in — just yours to go. Once you vote, roam2gether picks the group’s destination.</div></div>
    </div>`;
};

export const whereToGoSection = (crew, ranked, isLead) => {
  const tally = tallyVotes(crew, ranked);
  const rankOf = (result) => ranked.indexOf(result);
  const inVote = new Set(tally.candidates.map((t) => t.result.destination.id));
  const moreIdeas = ranked.filter((r) => !inVote.has(r.destination.id)).slice(0, 3);
  return `
    <h2 class="h2" style="margin-top:28px">Where to go</h2>
    <p class="h2sub">roam2gether’s best matches for the whole group — vote and roam2gether picks one.</p>
    ${whatIfToggle()}
    ${lockedShortlistBanner(isLead)}
    ${voteStatus(tally)}
    <div class="dgrid">
      ${tally.candidates
        .map((t) =>
          destinationCard(t.result, rankOf(t.result), {
            voting: {
              isDecided: tally.winnerId !== null,
              voters: t.voters,
              isVotedByViewer: tally.viewerVote === t.result.destination.id,
              isWinner: tally.winnerId === t.result.destination.id,
            },
          }),
        )
        .join('')}
    </div>
    ${
      moreIdeas.length
        ? `<h3 style="margin-top:28px">More ideas in the running</h3>
      <div class="minis">${moreIdeas.map(compactDestination).join('')}</div>`
        : ''
    }`;
};
