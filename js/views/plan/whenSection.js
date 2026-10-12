import { state } from '../../state/store.js';
import { formatDay } from '../../lib/dates.js';
import { MONTHS, getSeasonData } from '../../data/planContent.js';

const BEST_MONTH_COUNT = 2;
const COMFORTABLE_RANGE = [20, 31]; // °C

/** The months with the best mix of price and comfortable temperature. */
const bestMonths = (season) =>
  season.temperature
    .map((degrees, month) => {
      const isComfortable = degrees >= COMFORTABLE_RANGE[0] && degrees <= COMFORTABLE_RANGE[1];
      return { month, score: (4 - season.priceLevel[month]) * 2 + (isComfortable ? 2 : 0) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, BEST_MONTH_COUNT)
    .map((entry) => entry.month)
    .sort((a, b) => a - b);

const monthButton = (month, season, plan, best) => `
  <button class="mo ${plan.shortlistedMonths.includes(month) ? 'on' : ''} ${best.includes(month) ? 'best' : ''}" data-action="togglePlanMonth" data-value="${month}">
    <b>${MONTHS[month]}</b><span>${season.temperature[month]}°</span>
    <em>${'●'.repeat(season.priceLevel[month])}<u>${'●'.repeat(3 - season.priceLevel[month])}</u></em>
  </button>`;

export const whenSection = (plan, destination) => {
  const { trip } = state;
  const season = getSeasonData(destination);
  const best = bestMonths(season);
  const lockedNote =
    trip.timing === 'locked'
      ? `Your dates (${trip.dates.start ? `${formatDay(trip.dates.start)}–${formatDay(trip.dates.end)}` : 'TBC'}) are locked in.`
      : '';
  const shortlisted = plan.shortlistedMonths.length
    ? `Shortlisted: <b>${plan.shortlistedMonths.map((m) => MONTHS[m]).join(', ')}</b>.`
    : '';
  return `
    <div class="rec">✨ <b>roam2gether suggests ${best.map((m) => MONTHS[m]).join(' & ')}.</b> ${season.note}. ${lockedNote}</div>
    <div class="months">${MONTHS.map((_, month) => monthButton(month, season, plan, best)).join('')}</div>
    <div class="muted" style="font-size:13px;margin-top:8px">● price level · crew can tap months to show what works. ${shortlisted}</div>`;
};
