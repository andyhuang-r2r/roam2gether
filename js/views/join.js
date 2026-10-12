import { state } from '../state/store.js';
import { esc } from '../lib/utils.js';
import { formatDay } from '../lib/dates.js';
import { TRIP_TYPES } from '../data/tripOptions.js';
import { renderScene } from '../scenes/index.js';
import { crewSize } from '../logic/crew.js';
import { tripLengthOf } from '../logic/tripSummary.js';
import { header } from './components/header.js';

/** Participant welcome screen. Shows only safe basics — no emails, no budget. */
export const joinView = () => {
  const { trip, me } = state;
  const others = crewSize() - 1;
  const when =
    trip.timing === 'locked' && trip.dates.end
      ? `${formatDay(trip.dates.start)}–${formatDay(trip.dates.end)}`
      : tripLengthOf(trip);
  const withWhom = trip.type === 'two' ? 'for the two of you' : `with ${others} ${TRIP_TYPES[trip.type].companionNoun}`;
  return `
    <div class="screen">
      ${header()}
      <div class="welcome">
        <div class="cover">${renderScene('sun', 'bali')}</div>
        <span class="eyebrow">You’ve been invited</span>
        <h1 style="margin-top:8px">${esc(trip.lead)} is planning a ${esc(when)} escape ${withWhom}.</h1>
        <p style="font-size:18px;color:var(--ink2);margin-bottom:8px">You won’t be choosing flights or filling out a spreadsheet. Promise.</p>
        <p style="font-size:18px;margin-bottom:22px"><b>First: ten tiny travel dilemmas.</b> <span class="muted">About two minutes.</span></p>
        <div class="field">
          <span class="label">What should we call you? <small>optional</small></span>
          <input class="input" data-bind="me.name" placeholder="Sam" value="${esc(me.name === 'Sam' ? '' : me.name)}">
        </div>
        <button class="btn btn-pink btn-block" data-action="startQuiz">Let’s play →</button>
        <p class="muted" style="text-align:center;margin-top:14px;font-size:13px">Only ${esc(trip.lead)} sees who answered what. Everyone sees the middle ground.</p>
      </div>
    </div>`;
};
