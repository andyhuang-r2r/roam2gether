/**
 * Modal dialogs and the routes drawer.
 *
 * `modalView(modal)` is registered with the renderer in main.js. Each modal
 * type has its own small function; they all return an HTML string.
 */
import { state } from '../state/store.js';
import { esc } from '../lib/utils.js';
import { transportIcon, TRANSPORT_COLORS } from '../lib/icons.js';
import { cityName, CURRENCY_SYMBOL } from '../data/cities.js';
import { getDestination } from '../data/destinations.js';
import { getCrew, answeredCrew } from '../logic/crew.js';
import { average } from '../lib/utils.js';
import { buildContext, individualMatchPercent, rankDestinations, tipForWinningOver } from '../logic/scoring.js';
import { flightsFrom, getOrigins, regionOf } from '../logic/travel.js';
import { renderScene } from '../scenes/index.js';
import { avatar } from './components/avatar.js';
import { sheet } from './components/sheet.js';
import { loginModal } from './plan/loginModal.js';
import { shareModal } from './plan/shareModal.js';
import { appDownloadModal } from './plan/appDownloadModal.js';

const INVITE_LINK = 'rome2rio.com/roam2gether/j/maya-30th-k7x2';
export const NUDGE_MESSAGE =
  'The trip needs your expert opinion. It takes about two minutes and contains no spreadsheets.';

/* ---------- nudge ---------- */

const nudgeModal = ({ who }) => {
  const waiting = who
    ? [who]
    : getCrew()
        .filter((p) => !p.done)
        .map((p) => p.name);
  return sheet(`
    <h2>Nudge ${who ? esc(who) : 'the crew'}</h2>
    <p class="muted">Here’s the message. Cheeky, but not pushy.</p>
    <div class="msg"><b>The trip needs your expert opinion.</b> It takes about two minutes and contains no spreadsheets.
      <div class="muted" style="margin-top:6px;font-size:13px">${INVITE_LINK}</div></div>
    <p class="muted" style="font-size:14px;margin-bottom:16px">${waiting.length ? `To: ${waiting.map(esc).join(', ')}` : 'Everyone has had their say — nothing to chase!'}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-pink" data-action="sendNudge" ${waiting.length ? '' : 'disabled'}>Send nudge</button>
      <button class="btn btn-ghost" data-action="copyNudgeMessage">Copy message</button>
    </div>`);
};

/* ---------- lock a shortlist ---------- */

const shortlistOption = ({ destination, percent }, isSelected) => `
  <button class="opt ${isSelected ? 'on' : ''}" data-action="toggleLockChoice" data-value="${destination.id}">
    <span class="th">${renderScene(destination.scene, destination.sceneVariant)}</span>
    <span style="flex:1"><b style="font-family:Inter">${esc(destination.name)}</b><div class="muted" style="font-size:13px">${percent}% match</div></span>
    <span>${isSelected ? '✓' : ''}</span>
  </button>`;

const lockShortlistModal = ({ selected }) => {
  const ranked = rankDestinations(getCrew(), buildContext()).slice(0, 5);
  const count = selected.length;
  return sheet(`
    <h2>Lock a shortlist</h2>
    <p class="muted" style="margin-bottom:14px">Pick up to three. Your crew gets to vote on just these — no more endless options.</p>
    ${ranked.map((r) => shortlistOption(r, selected.includes(r.destination.id))).join('')}
    <button class="btn btn-pink btn-block" style="margin-top:10px" data-action="confirmLockShortlist" ${count ? '' : 'disabled'}>
      Lock ${count || ''} ${count === 1 ? 'idea' : 'ideas'}</button>`);
};

/* ---------- start over / late arrival ---------- */

const startOverModal = () =>
  sheet(`
    <h2>Start over with a new brief?</h2>
    <p class="muted" style="margin-bottom:20px">This clears the crew’s answers and takes you back to the practical basics. Your invite link stays the same.</p>
    <div style="display:flex;gap:10px">
      <button class="btn btn-ghost" data-action="closeModal">Keep the trip</button>
      <button class="btn btn-pink" data-action="confirmStartOver">Start fresh</button>
    </div>`);

const lateArrivalModal = () =>
  sheet(`
    <h2>Add a late arrival</h2>
    <p class="muted" style="margin-bottom:14px">Someone just said “wait, I want in.” Classic.</p>
    <input class="input" id="lateArrivalName" placeholder="Their name, e.g. Alex" style="margin-bottom:16px">
    <button class="btn btn-pink btn-block" data-action="confirmLateArrival">Add to the crew</button>`);

/* ---------- routes drawer ---------- */

const routeLeg = (mode, title, detail, right, rightDetail = '') => `
  <div class="leg">
    <span class="mico" style="background:${TRANSPORT_COLORS[mode]}">${transportIcon(mode)}</span>
    <div class="m"><b>${esc(title)}</b><small>${esc(detail)}</small></div>
    <div class="p">${esc(right)}<small>${esc(rightDetail)}</small></div>
  </div>`;

const hoursLabel = (hours) => `~${Math.floor(hours)}h${hours % 1 ? ' 30m' : ''}`;

const routesModal = ({ destinationId, originIndex = 0 }) => {
  const destination = getDestination(destinationId);
  const origins = getOrigins(state.trip);
  const origin = origins[originIndex] ?? origins[0];
  const region = regionOf(origin);
  const flight = flightsFrom(destination, region);
  const shortName = destination.name.split(' +')[0];
  const originPicker =
    origins.length > 1
      ? `<div class="seg" style="margin-bottom:16px">${origins
          .map(
            (o, i) =>
              `<button class="${i === originIndex ? 'on' : ''}" data-action="chooseRouteOrigin" data-value="${i}">From ${esc(cityName(o))}</button>`,
          )
          .join('')}</div>`
      : '';
  return `
    <div class="scrim" data-action="closeModal"></div>
    <div class="drawer">
      <button class="close" data-action="closeModal">✕</button>
      <span class="eyebrow">Mock routes</span>
      <h2 style="font-size:28px;margin:6px 0 14px">Getting to ${esc(destination.name)}</h2>
      ${originPicker}
      ${routeLeg('plane', `Fly ${cityName(origin)} → ${shortName}`, flight.stops, hoursLabel(flight.hours), `from ${CURRENCY_SYMBOL[region]}${flight.price}`)}
      <h4 style="margin:18px 0 10px">Getting around</h4>
      ${destination.localRoutes.map((r) => routeLeg(r.mode, r.title, r.duration, r.price)).join('')}
      <h4 style="margin:18px 0 10px">Where to stay</h4>
      ${routeLeg('hotel', destination.stay.title, `${state.trip.budget} feel`, destination.stay.price)}
      <p class="muted" style="font-size:13px;margin:16px 0">Illustrative only — live Rome2Rio routes would slot in here.</p>
      <button class="btn btn-pink btn-block" data-action="planTrip" data-value="${destination.id}">Plan your trip to ${esc(shortName)}</button>
      <button class="btn btn-ghost btn-block" style="margin-top:8px" data-action="closeModal">Back to results</button>
    </div>`;
};

/* ---------- compare with the group ---------- */

const fitBarColor = (percent) => (percent >= 80 ? 'var(--pink)' : percent >= 65 ? 'var(--ink)' : '#b9b6b6');

const fitRow = ({ person, percent }, destination) => {
  const tip = percent < 75 ? tipForWinningOver(person, destination) : '';
  return `
    <div class="fit">
      <span style="display:flex;gap:8px;align-items:center">${avatar(person, 'sm')}<b style="font-family:Inter">${esc(person.name)}</b></span>
      <div class="tb2"><i style="width:${percent}%;background:${fitBarColor(percent)}"></i></div>
      <b style="font-family:Inter">${percent}%</b>
      ${tip ? `<div class="fix">To win ${esc(person.name)} over: ${esc(tip)}</div>` : ''}
    </div>`;
};

const compareModal = ({ destinationId }) => {
  const destination = getDestination(destinationId);
  const context = buildContext();
  const fits = answeredCrew(getCrew())
    .map((person) => ({ person, percent: individualMatchPercent(person, destination, context) }))
    .sort((a, b) => b.percent - a.percent);
  if (!fits.length)
    return sheet('<h2>Nobody has answered yet</h2><p class="muted">Compare unlocks as soon as someone plays.</p>');
  const groupFit = Math.round(average(fits.map((f) => f.percent)));
  const fan = fits[0].person.name;
  const holdout = fits[fits.length - 1].person.name;
  return sheet(`
    <span class="eyebrow">Compare with the group</span>
    <h2 style="margin:6px 0 4px">How the crew feels about ${esc(destination.name)}</h2>
    <p class="muted" style="margin-bottom:12px">Group fit <b>${groupFit}%</b> · biggest fan <b>${esc(fan)}</b> · needs convincing: <b>${esc(holdout)}</b></p>
    ${fits.map((f) => fitRow(f, destination)).join('')}
    <button class="btn btn-pink btn-block" style="margin-top:12px" data-action="openRoutes" data-value="${destination.id}">Explore routes</button>`);
};

/* ---------- dispatcher ---------- */

const MODALS = {
  nudge: nudgeModal,
  lockShortlist: lockShortlistModal,
  startOver: startOverModal,
  lateArrival: lateArrivalModal,
  routes: routesModal,
  compare: compareModal,
  login: loginModal,
  share: shareModal,
  appDownload: appDownloadModal,
};

export const modalView = (modal) => MODALS[modal.type]?.(modal) ?? '';
