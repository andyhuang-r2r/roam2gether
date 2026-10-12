import { state } from '../../state/store.js';
import { esc } from '../../lib/utils.js';
import { describeTiming } from '../../logic/tripSummary.js';
import { crewSize, getCrew } from '../../logic/crew.js';
import { computeCrewStats, complicatedNews, crewHeadline, goodNews } from '../../logic/crewStats.js';
import { buildContext, rankDestinations } from '../../logic/scoring.js';
import { tallyVotes } from '../../logic/voting.js';
import { header } from '../components/header.js';
import { toolbox } from '../components/toolbox.js';
import { alignmentSection } from './alignmentSection.js';
import { crewSection, secretHopesSection } from './crewSection.js';
import { buildTakeaways, takeSection } from './takeSection.js';
import { whereToGoSection } from './whereToGo.js';

const summaryHero = (stats, crew, hasSampleSeat) => `
  <div class="hero2">
    <div class="meta">
      <span>${esc(state.trip.name)}</span>
      <span>${crew.filter((p) => p.done).length} of ${crewSize()} in${hasSampleSeat ? ' (1 sample)' : ''}</span>
      <span>${esc(describeTiming(state.trip, { short: true }))}</span>
    </div>
    <span class="eyebrow">roam2gether’s read of your crew</span>
    <h1>Your crew is leaning toward: ${esc(crewHeadline(stats))}.</h1>
    <div class="gc">
      <div><b>The good news</b>Nobody’s asking for the impossible — ${esc(goodNews(stats))}</div>
      <div><b>The complicated news</b>${esc(complicatedNews(stats))}</div>
    </div>
  </div>`;

const leadActions = (topId) => `
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
    <button class="btn btn-pink btn-sm" data-action="planTrip" data-value="${topId}">Plan your trip</button>
    <button class="btn btn-ink btn-sm" data-action="openNudge">👋 Nudge the crew</button>
    <button class="btn btn-ghost btn-sm" data-action="openLockShortlist">📌 Lock a shortlist</button>
    <button class="btn btn-ghost btn-sm" data-action="openLateArrival">➕ Add a late arrival</button>
    <button class="btn btn-ghost btn-sm" data-action="openStartOver">🔄 Start over</button>
    <button class="btn btn-ghost btn-sm" data-action="previewParticipant">Preview as participant</button>
  </div>`;

const sampleSeatNotice = () => `
  <div class="lockbox" style="background:#fff;border-style:dashed;margin-top:16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap">
    <span style="flex:1;min-width:200px"><b style="font-family:Inter">Sam’s seat is showing sample answers.</b><br>
      <span class="muted">Play the ten dilemmas yourself and watch the results shift.</span></span>
    <button class="btn btn-pink btn-sm" data-action="playAsYourself">Play as yourself</button>
  </div>`;

export const resultsView = () => {
  const isLead = state.role === 'lead';
  const crew = getCrew();
  const stats = computeCrewStats(crew.filter((p) => p.done));
  const ranked = rankDestinations(crew, buildContext());
  const hasSampleSeat = crew.some((p) => p.isSample && p.done);

  return `
    <div class="screen">
      ${header()}
      <div class="wrap">
        ${whereToGoSection(crew, ranked, isLead)}
        <div class="rhead" style="margin-top:44px">
          ${summaryHero(stats, crew, hasSampleSeat)}
          ${isLead ? leadActions(tallyVotes(crew, ranked).winnerId ?? ranked[0].destination.id) : ''}
          ${hasSampleSeat ? sampleSeatNotice() : ''}
        </div>

        ${alignmentSection(stats)}
        ${crewSection(crew)}
        ${takeSection(buildTakeaways(stats, ranked))}

        ${secretHopesSection(crew)}
        ${isLead ? `<div style="margin-top:40px">${toolbox()}</div>` : ''}
        <div class="foot">Mocked results · no live Rome2Rio routing or AI calls.</div>
      </div>
    </div>`;
};
