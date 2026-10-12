import { state } from '../../state/store.js';
import { esc } from '../../lib/utils.js';
import { cityName, CURRENCY_SYMBOL } from '../../data/cities.js';
import { AIRPORT_CODES } from '../../data/planContent.js';
import { priceHistory } from '../../logic/planner.js';
import { flightsFrom, getOrigins, regionOf } from '../../logic/travel.js';

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
    </div>`;
};

/** Banner shown when the first origin's fare is at or under the alert threshold. */
const alertBanner = (origin, destination, plan) => {
  const alert = plan.priceAlert;
  const region = regionOf(origin);
  const history = priceHistory(destination, region, plan);
  const current = history[history.length - 1];
  if (!alert.enabled || current > alert.threshold) return '';
  const symbol = CURRENCY_SYMBOL[region] ?? 'US$';
  return `
    <div class="alertbox">🔔 <b>Price alert:</b> ${esc(cityName(origin))} → ${AIRPORT_CODES[destination.id] ?? ''} dropped to ${symbol}${formatNumber(current)} — below your ${symbol}${formatNumber(alert.threshold)}.
      <button class="link" data-action="openAd">View on Rome2Rio</button></div>`;
};

const alertPanel = (plan, symbol) => {
  const alert = plan.priceAlert;
  const channels = [
    ['email', 'Email'],
    ['app', 'App notification'],
  ];
  return `
    <div class="alertpanel">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <button class="switch ${alert.enabled ? 'on' : ''}" data-action="togglePriceAlert" aria-label="Toggle alert"><i></i></button>
        <div style="flex:1;min-width:180px"><b style="font-family:Inter">Alert me when a flight drops below</b>
          <div class="muted" style="font-size:13px">We’ll tell you the moment it does, wherever you’re planning from.</div></div>
        <div class="stepper">
          <button data-action="changeAlertThreshold" data-value="-50">−</button>
          <span style="min-width:90px">${symbol}${formatNumber(alert.threshold)}</span>
          <button data-action="changeAlertThreshold" data-value="50">+</button>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;align-items:center">
        <span class="muted" style="font-size:13px">Notify by</span>
        ${channels.map(([key, label]) => `<button class="chip sm ${alert.channels.includes(key) ? 'on' : ''}" data-action="toggleAlertChannel" data-value="${key}">${label}</button>`).join('')}
        <span style="flex:1"></span>
        <button class="btn btn-ghost btn-sm" data-action="toggleSimulatedDrop">${alert.simulatedDrop ? 'Reset demo price' : 'Demo: simulate a price drop'}</button>
      </div>
    </div>`;
};

export const flightsSection = (plan, destination) => {
  const origins = getOrigins(state.trip);
  const symbol = CURRENCY_SYMBOL[regionOf(origins[0])] ?? 'US$';
  return `
    ${alertBanner(origins[0], destination, plan)}
    <div class="frows">${origins.map((origin) => fareRow(origin, destination, plan)).join('')}</div>
    ${alertPanel(plan, symbol)}`;
};
