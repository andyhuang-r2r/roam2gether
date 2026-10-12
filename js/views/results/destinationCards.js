import { esc } from '../../lib/utils.js';
import { renderScene } from '../../scenes/index.js';
import { avatar } from '../components/avatar.js';
import { transportPaths } from '../../lib/icons.js';

const MAX_FLIGHT_HOURS = 26;

const haulLabel = (hours) => (hours <= 10 ? 'short' : hours <= 16 ? 'medium' : 'long');

/** Voter avatars + the vote button for one candidate. */
const votePanel = (destination, { voters, isVotedByViewer, isDecided, isWinner }) => `
  <div class="votebar ${isWinner ? 'won' : ''}">
    <div class="voters">
      ${voters.map((p) => avatar(p, 'xs')).join('')}
      <b style="font-family:Inter;margin-left:6px">${voters.length} ${voters.length === 1 ? 'vote' : 'votes'}</b>
    </div>
    ${isDecided ? '' : `<button class="btn ${isVotedByViewer ? 'btn-ink' : 'btn-pink'} btn-sm" data-action="castVote" data-value="${destination.id}">Vote for this</button>`}
  </div>`;

/**
 * A destination card.
 * @param {{destination, percent, hours}} result
 * @param {number} rank zero-based position in the overall ranking
 * @param {{voting:{voters:object[], isVotedByViewer:boolean, isDecided:boolean, isWinner:boolean}}} options
 */
export const destinationCard = ({ destination, percent, hours }, rank, { voting }) => `
  <article class="dcard ${voting.isWinner ? 'winner' : ''}" style="animation-delay:${rank * 0.1}s">
    <div class="img">
      ${renderScene(destination.scene, destination.sceneVariant)}
      <div class="ov"></div>
      <span class="rank">${voting.isWinner ? '🎉 The one' : `#${rank + 1} pick`}</span>
      <div class="nmx"><b>${esc(destination.name)}</b><span>${esc(destination.country)}</span></div>
      <div class="match" style="--p:${percent}"><i>${percent}%<small>match</small></i></div>
    </div>
    <div class="bd">
      ${votePanel(destination, voting)}
      <div class="ft">
        <span class="ico"><svg viewBox="0 0 24 24">${transportPaths('plane')}</svg></span>
        <b style="font-family:Inter">~${Math.round(hours)}h</b>
        <div class="ftbar"><i style="width:${Math.min(100, (hours / MAX_FLIGHT_HOURS) * 100)}%"></i></div>
        <span class="muted" style="font-size:12px">${haulLabel(hours)}-haul</span>
      </div>
      <p>${esc(destination.blurb)}</p>
      <div class="chips">${destination.whyItWorks.map((tag) => `<span class="tag pink">${esc(tag)}</span>`).join('')}</div>
      <div class="watch"><b>Watch out:</b> ${esc(destination.watchOut)}</div>
    </div>
    <div class="acts">
      <button class="btn btn-pink" data-action="openRoutes" data-value="${destination.id}">Explore routes</button>
      <button class="btn btn-ghost" data-action="openCompare" data-value="${destination.id}">Compare with the group</button>
      <button class="btn btn-ink" data-action="planTrip" data-value="${destination.id}">Plan your trip →</button>
    </div>
  </article>`;

/** Compact "more ideas" row. */
export const compactDestination = ({ destination, percent, hours }) => `
  <div class="mini2" data-action="openRoutes" data-value="${destination.id}">
    <div class="th">${renderScene(destination.scene, destination.sceneVariant)}</div>
    <div style="flex:1">
      <b style="font-family:Inter">${esc(destination.name)}</b>
      <div class="muted" style="font-size:13px">${percent}% match · ~${Math.round(hours)}h</div>
    </div>
    <span class="link" style="font-size:13px">Routes</span>
  </div>`;
