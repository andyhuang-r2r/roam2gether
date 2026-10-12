import { esc } from '../../lib/utils.js';
import { renderScene } from '../../scenes/index.js';
import { crewSize, getCrew } from '../../logic/crew.js';
import { describeCrew, describeOrigins, describeTiming } from '../../logic/tripSummary.js';

const progressStatus = (done, total) => `
  <div class="status">
    <div class="ring" style="--p:${Math.round((done / total) * 100)}"><i>${done}/${total}</i></div>
    <div>
      <b style="font-family:Inter">${done} of ${total} traveller${total > 1 ? 's' : ''} ${done === 1 ? 'has' : 'have'} had their say</b>
      <div class="muted" style="font-size:13px">${done < total ? 'roam2gether is waiting on the rest.' : 'Everyone’s in!'}</div>
    </div>
  </div>`;

/**
 * The shareable trip card (invite screen + live preview during setup).
 * @param {object} trip
 * @param {{hideStatus?: boolean}} [options]
 */
export const shareCard = (trip, { hideStatus = false } = {}) => {
  const total = crewSize();
  const done = getCrew().filter((p) => p.done).length;
  const lateCount = total - trip.adults;
  return `
    <div class="share">
      <div class="cover">
        ${renderScene('sun', 'bali')}
        <span class="by">Trip Lead · ${esc(trip.lead)}</span>
        <div class="ttl">${esc(trip.name || 'Our group trip')}</div>
      </div>
      <div class="body">
        <div class="r"><span>👥</span><span><b>Crew:</b> ${describeCrew(trip)}${lateCount > 0 ? ` (+${lateCount} late)` : ''}, leaving from ${esc(describeOrigins(trip))}</span></div>
        <div class="r"><span>🗓️</span><span><b>Timing:</b> ${esc(describeTiming(trip))}</span></div>
        <div class="r"><span>💸</span><span><b>Budget feel:</b> ${esc(trip.budget)}${trip.nonNegotiable ? ` · “${esc(trip.nonNegotiable)}”` : ''}</span></div>
        ${hideStatus ? '' : progressStatus(done, total)}
      </div>
    </div>`;
};
