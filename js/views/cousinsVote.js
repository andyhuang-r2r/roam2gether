/**
 * The cousins' vote. Deliberately the same look and feel as the main trip's results page:
 * "Where to go" cards with a vote, then the group read, alignment and the people.
 */
import { state } from '../state/store.js';
import { esc } from '../lib/utils.js';
import { getDestination } from '../data/destinations.js';
import { avatar } from './components/avatar.js';
import { header } from './components/header.js';
import { cousinVoteState, cousinsCrewList } from '../logic/cousinsVote.js';
import { computeCrewStats, complicatedNews, crewHeadline, goodNews } from '../logic/crewStats.js';
import { destinationCard } from './results/destinationCards.js';
import { alignmentSection } from './results/alignmentSection.js';

const waitingStrip = (voteState) => `
  <div class="cv-voters-row">
    ${[{ name: 'You', color: '#DE007B', voted: Boolean(voteState.myVote) }, ...voteState.cousins]
      .map(
        (person) => `<div class="cv-voter ${person.voted ? 'in' : ''}">${avatar(person, 'sm')}<b>${esc(person.name)}</b>
          <small>${person.voted ? '✓ voted' : '<span class="cv-dots"><i></i><i></i><i></i></span> waiting'}</small></div>`,
      )
      .join('')}
  </div>`;

const voteStatus = (voteState) => {
  if (voteState.winnerId) {
    const winner = voteState.candidates.find((c) => c.destination.id === voteState.winnerId);
    return `
      <div class="winnerbox">
        <div><span class="eyebrow" style="color:#fff;opacity:.85">Everyone has voted</span>
          <h3 style="margin:4px 0 2px">The cousins are going to ${esc(winner.destination.name)} 🎉</h3>
          <div style="opacity:.9;font-size:14px">${winner.voters.length} of 6 votes · ${winner.percent}% match</div></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-white" data-action="planCousinsTrip">Plan your trip →</button>
          <button class="btn btn-ghost-light" data-action="changeCousinsVote">Change my vote</button>
        </div>
      </div>`;
  }
  const line = voteState.allCousinsIn
    ? 'All the cousins have voted — just yours to go.'
    : `Waiting on ${voteState.waitingOn} ${voteState.waitingOn === 1 ? 'cousin' : 'cousins'}…${voteState.myVote ? ' Your vote is in.' : ''}`;
  return `
    <div class="votehead">
      <div><b style="font-family:Inter">Cast your vote</b>
        <div class="muted" style="font-size:14px">${line} Once everyone has voted, roam2gether picks the group’s destination.</div></div>
    </div>
    ${waitingStrip(voteState)}`;
};

const summaryHero = (stats) => `
  <div class="hero2">
    <div class="meta"><span>${esc(state.cousins.trip.name)}</span><span>6 of 6 in</span><span>Next year</span></div>
    <span class="eyebrow">roam2gether’s read of your group</span>
    <h1>Your group is leaning toward: ${esc(crewHeadline(stats))}.</h1>
    <div class="gc">
      <div><b>The good news</b>Nobody’s asking for the impossible — ${esc(goodNews(stats))}</div>
      <div><b>The complicated news</b>${esc(complicatedNews(stats))}</div>
    </div>
  </div>`;

const peopleSection = (crew) => `
  <h2 class="h2">The group</h2>
  <p class="h2sub">${crew.length} of ${crew.length} have had their say.</p>
  <div class="people">${crew
    .map(
      (person) => `
    <div class="pc">
      ${avatar(person, 'lg')}
      <div class="nm">${esc(person.name)}${person.isMe ? ' <small>(you)</small>' : ''}<small>${person.isLead ? '· Trip Lead' : ''}</small></div>
      <div class="chips">${person.labels.map((label) => `<span class="tag">${esc(label)}</span>`).join('')}</div>
      <div class="q">“${esc(person.hope)}”</div>
    </div>`,
    )
    .join('')}</div>`;

export const cousinsVoteView = () => {
  const voteState = cousinVoteState();
  const crew = cousinsCrewList();
  const stats = computeCrewStats(crew);
  const decided = voteState.winnerId !== null;
  const cards = voteState.candidates
    .map((candidate, rank) =>
      destinationCard(candidate, rank, {
        voting: {
          isDecided: decided,
          voters: candidate.voters,
          isVotedByViewer: voteState.myVote === candidate.destination.id,
          isWinner: voteState.winnerId === candidate.destination.id,
          voteAction: 'castCousinsVote',
          actsHtml: decided && voteState.winnerId === candidate.destination.id
            ? '<div class="acts"><button class="btn btn-pink" data-action="planCousinsTrip">Plan your trip →</button></div>'
            : '',
        },
      }),
    )
    .join('');
  return `
    <div class="screen">
      ${header()}
      <div class="wrap">
        <button class="trip-back cv-back" data-action="openTrips">← My trips</button>
        <h2 class="h2" style="margin-top:12px">Where to go</h2>
        <p class="h2sub">roam2gether’s best matches for the cousins — vote and roam2gether picks one.</p>
        ${voteStatus(voteState)}
        <div class="dgrid">${cards}</div>
        <div class="rhead" style="margin-top:44px">${summaryHero(stats)}</div>
        ${alignmentSection(stats)}
        ${peopleSection(crew)}
        <div class="foot">Mocked results · no live Rome2Rio routing or AI calls.</div>
      </div>
    </div>`;
};
