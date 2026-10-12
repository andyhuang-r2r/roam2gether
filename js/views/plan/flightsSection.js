import { state } from '../../state/store.js';
import { clamp, esc } from '../../lib/utils.js';
import { cityName, CURRENCY_SYMBOL } from '../../data/cities.js';
import { AIRPORT_CODES } from '../../data/planContent.js';
import { isAlertOn, priceHistory } from '../../logic/planner.js';
import { bookButton } from '../../logic/booking.js';
import { flightPrice, flightsFrom, getOrigins, regionOf } from '../../logic/travel.js';

const formatNumber = (n) => Math.round(n).toLocaleString('en-US');

/** Tiny SVG line chart of the last 12 weeks. */
const sparkline = (values, width = 170, height = 46) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, i) => [
    (i / (values.length - 1)) * (width - 8) + 4,
    height - 6 - ((value - min) / (max - min || 1)) * (height - 12),
  ]);
  const [lastX, lastY] = points[points.length - 1];
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <polyline points="${points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}" fill="none" stroke="var(--plane)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="4.5" fill="var(--plane)"/>
    </svg>`;
};

const priceBadge = (current, history) => {
  const average = history.reduce((sum, v) => sum + v, 0) / history.length;
  const percentVsAverage = Math.round(((current - average) / average) * 100);
  const isLowest = current <= Math.min(...history);
  const label = isLowest
    ? 'Lowest in 12 weeks'
    : percentVsAverage < 0
      ? `${-percentVsAverage}% below average`
      : `${percentVsAverage}% above average`;
  return `<span class="tag ${percentVsAverage < 0 ? 'pink' : ''}">${label}</span>`;
};

const fareRow = (origin, destination, plan) => {
  const region = regionOf(origin);
  const history = priceHistory(destination, region, plan);
  const current = history[history.length - 1];
  const symbol = CURRENCY_SYMBOL[region] ?? 'US$';
  const code = AIRPORT_CODES[destination.id] ?? '';
  return `
    <div class="frow">
      <div style="flex:1">
        <div class="muted" style="font-size:12px;font-family:Inter;font-weight:600;letter-spacing:.05em">${esc(cityName(origin).toUpperCase())} → ${code}</div>
        <div class="fp">${symbol}${formatNumber(current)} <small>return · ${esc(flightsFrom(destination, region).stops)}</small></div>
        ${priceBadge(current, history)}
      </div>
      <div class="spk">${sparkline(history)}<div class="muted" style="font-size:11px;text-align:right">last 12 weeks</div></div>
      <div class="fbook">${bookButton('Book', `flight ${cityName(origin)} → ${destination.name.split(' +')[0]}`)}</div>
    </div>`;
};

/** Banner shown when the first origin's fare is at or under the alert threshold. */
export const alertBannerHtml = (plan, destination) => {
  const origin = getOrigins(state.trip)[0];
  const region = regionOf(origin);
  const current = priceHistory(destination, region, plan).at(-1);
  const { threshold } = plan.priceAlert;
  if (!isAlertOn(plan) || current > threshold) return '';
  const symbol = CURRENCY_SYMBOL[region] ?? 'US$';
  return `
    <div class="alertbox">🔔 <b>Price alert:</b> ${esc(cityName(origin))} → ${AIRPORT_CODES[destination.id] ?? ''} dropped to ${symbol}${formatNumber(current)} — below your ${symbol}${formatNumber(threshold)}.
      <button class="link" data-action="openAd">View on Rome2Rio</button></div>`;
};

/** Slider limits around the usual fare: 60% to 115%, in steps of 10. */
const sliderRange = (destination, region) => {
  const base = flightPrice(destination, region);
  return { min: Math.round((base * 0.6) / 10) * 10, max: Math.round((base * 1.15) / 10) * 10, step: 10 };
};

const channelButton = (plan, { key, icon, label, detail }) => {
  const isOn = plan.priceAlert.channels.includes(key);
  return `
    <button class="alert-opt ${isOn ? 'on' : ''}" data-action="toggleAlertChannel" data-value="${key}" aria-pressed="${isOn}" title="${esc(detail)}">
      <span class="alert-opt-icon">${icon}</span><b>${label}</b><span class="alert-opt-state">${isOn ? '✓' : '+'}</span>
    </button>`;
};

const alertPanel = (plan, destination) => {
  const region = regionOf(getOrigins(state.trip)[0]);
  const symbol = CURRENCY_SYMBOL[region] ?? 'US$';
  const { min, max, step } = sliderRange(destination, region);
  const threshold = clamp(plan.priceAlert.threshold, min, max);
  const email = state.user?.email || 'your email';
  return `
    <div class="alertpanel">
      <div class="alert-set">
        <div class="alert-head">
          <b>🔔 Alert me below</b>
          <span class="alert-value">${symbol}<span id="alertValue">${formatNumber(threshold)}</span></span>
        </div>
        <input class="price-slider" type="range" min="${min}" max="${max}" step="${step}" value="${threshold}"
               data-input="alertThreshold" data-symbol="${symbol}" aria-label="Price alert threshold">
      </div>
      <div class="alert-via">
        <span class="alert-via-label">Notify me by</span>
        <div class="alert-channels">
          ${channelButton(plan, { key: 'email', icon: '✉️', label: 'Email', detail: email })}
          ${channelButton(plan, { key: 'app', icon: '📱', label: 'App', detail: 'Rome2Rio app' })}
        </div>
      </div>
      <div class="muted alert-status">${isAlertOn(plan) ? '✓ Alert on — we’ll tell you when a fare drops below your price.' : 'Choose email or the app to switch the alert on.'}</div>
    </div>`;
};

export const flightsSection = (plan, destination) => {
  const origins = getOrigins(state.trip);
  return `
    <div id="alertBannerSlot">${alertBannerHtml(plan, destination)}</div>
    <div class="frows">${origins.map((origin) => fareRow(origin, destination, plan)).join('')}</div>
    ${alertPanel(plan, destination)}`;
};
