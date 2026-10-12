/**
 * Trip Lead setup: four steps plus a summary.
 * Each step is its own function; `setupView` stitches them together.
 */
import { state, ui } from '../state/store.js';
import { esc } from '../lib/utils.js';
import { MONTH_LONG, MONTH_SHORT, TODAY_ISO, countDays, formatDay, toIso, tripLengthLabel } from '../lib/dates.js';
import { searchCities } from '../data/cities.js';
import {
  BUDGET_LEVELS,
  DREAM_WINDOWS,
  KID_AGE_BUCKETS,
  NON_NEGOTIABLE_EXAMPLES,
  SEASONS,
  TRIP_LENGTHS,
  TRIP_TYPES,
} from '../data/tripOptions.js';
import { describeCrew, describeOrigins, describeTiming } from '../logic/tripSummary.js';
import { header } from './components/header.js';
import { shareCard } from './components/shareCard.js';

const STEP_TITLES = ['The crew', 'The starting point', 'The time situation', 'The basics', 'All set?'];
const LAST_INPUT_STEP = 4;
const SUMMARY_STEP = 5;

const onClass = (isOn) => (isOn ? 'on' : '');

/** A pill-style option button. */
const chip = (label, isOn, action, value, extra = '') =>
  `<button class="chip ${onClass(isOn)}" data-action="${action}" data-value="${esc(value)}" ${extra}>${esc(label)}</button>`;

/** A large tile option button. */
const tile = ({ icon, title, hint }, isOn, action, value) => `
  <button class="tile ${onClass(isOn)}" data-action="${action}" data-value="${esc(value)}">
    <span class="ic">${icon}</span><span><b>${esc(title)}</b><small>${esc(hint)}</small></span>
  </button>`;

/* ---------- Step 1: the crew ---------- */

const kidAgeRows = (draft) =>
  draft.kidAges
    .map(
      (age, index) => `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b style="font-family:Inter;font-size:14px">Child ${index + 1}</b>
          <button class="link" style="font-size:13px" data-action="removeKid" data-index="${index}">remove</button>
        </div>
        <div class="chips">
          ${KID_AGE_BUCKETS.map(
            (bucket) =>
              `<button class="chip sm ${onClass(age === bucket)}" data-action="setKidAge" data-index="${index}" data-value="${bucket}">${bucket}</button>`,
          ).join('')}
        </div>
      </div>`,
    )
    .join('');

const crewStep = (draft) => `
  <h1>Who’s coming along?</h1>
  <div class="field">
    <div class="tiles c2">
      ${Object.entries(TRIP_TYPES)
        .map(([key, type]) =>
          tile({ icon: type.icon, title: type.label, hint: type.hint }, draft.type === key, 'setTripType', key),
        )
        .join('')}
    </div>
  </div>
  <div class="field">
    <span class="label">Number of adults</span>
    <div class="stepper">
      <button data-action="changeAdults" data-value="-1" ${draft.adults <= 2 ? 'disabled' : ''}>−</button>
      <span>${draft.adults}</span>
      <button data-action="changeAdults" data-value="1" ${draft.adults >= 12 ? 'disabled' : ''}>+</button>
    </div>
  </div>
  <div class="field">
    <span class="label">Any kids?</span>
    <div class="seg">
      <button class="${onClass(!draft.hasKids)}" data-action="setHasKids" data-value="no">No</button>
      <button class="${onClass(draft.hasKids)}" data-action="setHasKids" data-value="yes">Yes</button>
    </div>
    ${
      draft.hasKids
        ? `<div style="margin-top:16px">${kidAgeRows(draft)}<button class="btn btn-ghost btn-sm" data-action="addKid">+ Add a child</button></div>`
        : ''
    }
  </div>
  <div class="field">
    <span class="label">Name your trip <small>optional</small></span>
    <input class="input" data-bind="draft.name" placeholder="e.g. Maya’s 30th escape" value="${esc(draft.name)}">
  </div>`;

/* ---------- Step 2: the starting point ---------- */

const originInput = (index, value) => `
  <div class="ac">
    <input class="input" id="origin${index}" data-input="origin" data-index="${index}" autocomplete="off"
           placeholder="City or airport" value="${esc(value)}">
    <div class="ac-list" id="originSuggestions${index}"></div>
  </div>`;

const startingPointStep = (draft) => {
  const isMulti = draft.originMode === 'multi';
  const origins = isMulti ? draft.origins : [draft.origins[0] || ''];
  return `
    <h1>Where is everyone leaving from?</h1>
    <div class="field">
      <div class="seg">
        <button class="${onClass(!isMulti)}" data-action="setOriginMode" data-value="one">One place</button>
        <button class="${onClass(isMulti)}" data-action="setOriginMode" data-value="multi">Different places</button>
      </div>
    </div>
    <div class="field">
      <span class="label">${isMulti ? 'Departure cities' : 'Departure city or airport'} <small>${isMulti ? 'add two or three' : ''}</small></span>
      ${origins
        .map(
          (origin, index) => `
          <div class="orow">
            ${originInput(index, origin)}
            ${isMulti && draft.origins.length > 2 ? `<button class="x" data-action="removeOrigin" data-index="${index}">×</button>` : ''}
          </div>`,
        )
        .join('')}
      ${isMulti && draft.origins.length < 3 ? '<button class="btn btn-ghost btn-sm" data-action="addOrigin">+ Add another city</button>' : ''}
    </div>
    <p class="muted" style="font-size:14px">roam2gether uses this to keep travel times fair for everyone. No flights are booked. Promise.</p>`;
};

/** Suggestion rows for the origin autocomplete (rendered on demand, not in the template). */
export const originSuggestionsHtml = (index, query) =>
  searchCities(query)
    .map(
      (city) =>
        `<button data-action="pickCity" data-index="${index}" data-value="${city.name} (${city.code})">${city.name}, ${city.country} <small>${city.code}</small></button>`,
    )
    .join('');

/* ---------- Step 3: the time situation ---------- */

const TIMING_OPTIONS = [
  { key: 'locked', icon: '📅', title: 'Dates are locked in', hint: 'Leave is approved, flights are calling' },
  { key: 'rough', icon: '🌤️', title: 'We have a rough window', hint: '“Sometime in March-ish”' },
  { key: 'dreaming', icon: '💭', title: 'Still dreaming', hint: 'No dates. Only vibes.' },
];

/** One month of the date picker. */
const calendarMonth = (year, monthIndex, { start, end }) => {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = (firstDay.getDay() + 6) % 7; // weeks start on Monday
  const cells = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const iso = toIso(year, monthIndex, day);
    let cls = '';
    if (iso === start) cls = `start${end ? ' in s' : ''}`;
    else if (iso === end) cls = 'end';
    else if (start && end && iso > start && iso < end) cls = 'in';
    const isPast = iso < TODAY_ISO;
    return `<button class="${cls}" ${isPast ? 'disabled' : ''} data-action="pickDate" data-value="${iso}">${day}</button>`;
  });
  return `
    <div>
      <b style="font-family:Inter">${MONTH_LONG[monthIndex]} ${year}</b>
      <div class="calgrid" style="margin-top:8px">
        ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => `<div class="dow">${d}</div>`).join('')}
        ${'<div></div>'.repeat(leadingBlanks)}${cells.join('')}
      </div>
    </div>`;
};

const dateRangePicker = (draft) => {
  const { year, month } = ui.calendar;
  const [nextYear, nextMonth] = month === 11 ? [year + 1, 0] : [year, month + 1];
  const { start, end } = draft.dates;
  let caption = 'Pick your first day';
  if (start)
    caption = end
      ? `${formatDay(start)} → ${formatDay(end)} · ${countDays(start, end)} days`
      : 'Now pick your last day';
  return `
    <div class="cal">
      <div class="calhead">
        <button class="x" data-action="previousMonth">‹</button>
        <span class="muted" style="font-size:14px">${caption}</span>
        <button class="x" data-action="nextMonth">›</button>
      </div>
      <div class="calmonths">
        ${calendarMonth(year, month, draft.dates)}
        <div class="m2">${calendarMonth(nextYear, nextMonth, draft.dates)}</div>
      </div>
    </div>`;
};

/** The next twelve months as { label: "March" | "March 2027", short: "Mar ’27" }. */
const upcomingMonths = () =>
  Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (10 + i) % 12; // starts at November 2026
    const year = 2026 + Math.floor((10 + i) / 12);
    return {
      label: MONTH_LONG[monthIndex] + (year > 2026 ? ` ${year}` : ''),
      short: MONTH_SHORT[monthIndex] + (year > 2026 ? ` ’${String(year).slice(2)}` : ''),
    };
  });

const roughWindowControls = (draft) => `
  <div class="field">
    <span class="label">Which months?</span>
    <div class="chips">${upcomingMonths()
      .map((m) => chip(m.short, draft.months.includes(m.label), 'toggleMonth', m.label))
      .join('')}</div>
    <div class="chips" style="margin-top:10px">${SEASONS.map((s) => chip(s, draft.seasons.includes(s), 'toggleSeason', s)).join('')}</div>
  </div>
  <div class="field">
    <span class="label">How many days?</span>
    <div class="stepper">
      <button data-action="changeDays" data-value="-1" ${draft.days <= 2 ? 'disabled' : ''}>−</button>
      <span>${draft.days}</span>
      <button data-action="changeDays" data-value="1" ${draft.days >= 21 ? 'disabled' : ''}>+</button>
    </div>
    <span class="muted" style="margin-left:8px">${tripLengthLabel(draft.days)}</span>
  </div>`;

const tripLengthChips = (draft) => `
  <div class="field">
    <span class="label">Rough trip length</span>
    <div class="chips">${TRIP_LENGTHS.map((l) => chip(l, draft.length === l, 'setTripLength', l)).join('')}</div>
  </div>`;

const dreamingControls = (draft) => `
  <div class="field">
    <span class="label">Roughly when?</span>
    <div class="chips">${DREAM_WINDOWS.map((w) => chip(w, draft.dreamWindow === w, 'setDreamWindow', w)).join('')}</div>
  </div>
  ${tripLengthChips(draft)}`;

const timingStep = (draft) => {
  let details = '';
  if (draft.timing === 'locked')
    details = `<div class="field"><span class="label">Pick your dates</span>${dateRangePicker(draft)}</div>`;
  if (draft.timing === 'rough') details = roughWindowControls(draft);
  if (draft.timing === 'dreaming') details = dreamingControls(draft);
  return `
    <h1>When could this happen?</h1>
    <div class="tiles">
      ${TIMING_OPTIONS.map((o) => tile(o, draft.timing === o.key, 'setTiming', o.key)).join('')}
    </div>
    <div style="margin-top:26px">${details}</div>`;
};

/* ---------- Step 4: the basics ---------- */

const basicsStep = (draft) => `
  <h1>The basics</h1>
  <div class="field">
    <span class="label">Budget feel</span>
    <div class="tiles c2">
      ${BUDGET_LEVELS.map((b) => tile({ icon: b.icon, title: b.label, hint: b.hint }, draft.budget === b.label, 'setBudget', b.label)).join('')}
    </div>
  </div>
  <div class="field">
    <span class="label">Anything non-negotiable already? <small>optional</small></span>
    <textarea class="input" data-bind="draft.nonNegotiable"
      placeholder="“No overnight flights”, “My dad needs easy walking”, “Somewhere with proper food.”">${esc(draft.nonNegotiable)}</textarea>
    <div class="chips" style="margin-top:10px">
      ${NON_NEGOTIABLE_EXAMPLES.map((example) => `<button class="chip sm" data-action="addNonNegotiable" data-value="${example}">+ ${example}</button>`).join('')}
    </div>
  </div>`;

/* ---------- Step 5: summary ---------- */

const summaryRow = (icon, label, value) =>
  `<div class="row"><span class="ico">${icon}</span><div><small>${label}</small><b>${esc(value)}</b></div></div>`;

const summaryStep = (draft) => `
  <h1>Looking good, ${esc(draft.lead)}.</h1>
  <div class="card">
    <div class="sum">
      ${summaryRow(TRIP_TYPES[draft.type].icon, 'Crew', `${TRIP_TYPES[draft.type].label} · ${describeCrew(draft)}`)}
      ${summaryRow('🛫', 'Leaving from', describeOrigins(draft))}
      ${summaryRow('🗓️', 'Timing', describeTiming(draft))}
      ${summaryRow('💸', 'Budget feel', draft.budget)}
      ${draft.nonNegotiable ? summaryRow('🔒', 'Non-negotiable', draft.nonNegotiable) : ''}
    </div>
    <p class="muted" style="margin-top:18px;font-size:15px">Next, roam2gether sends your crew ten tiny dilemmas — so you don’t have to chase anyone for an opinion.</p>
  </div>`;

/* ---------- page ---------- */

const STEP_RENDERERS = [crewStep, startingPointStep, timingStep, basicsStep, summaryStep];

const nextButton = (step, draft) => {
  if (step === SUMMARY_STEP)
    return '<button class="btn btn-pink" data-action="createTrip">Create trip & invite the crew</button>';
  const needsEndDate = step === 3 && draft.timing === 'locked' && !draft.dates.end;
  return `<button class="btn btn-pink" data-action="nextStep" ${needsEndDate ? 'disabled' : ''}>${step === LAST_INPUT_STEP ? 'Review my trip' : 'Next'} →</button>`;
};

export const setupView = () => {
  const draft = state.draft ?? state.trip;
  const step = state.setupStep;
  return `
    <div class="screen">
      ${header()}
      <div class="wrap">
        <div class="setup">
          <div>
            <div style="margin-top:6px">
              <div style="display:flex;justify-content:space-between;font:600 13px Inter;margin-bottom:8px">
                <span class="eyebrow">Step ${Math.min(step, LAST_INPUT_STEP)} of ${LAST_INPUT_STEP} · ${STEP_TITLES[step - 1]}</span>
                <span class="muted">${Math.round((step / SUMMARY_STEP) * 100)}%</span>
              </div>
              <div class="bar"><i style="width:${(step / SUMMARY_STEP) * 100}%"></i></div>
            </div>
            ${STEP_RENDERERS[step - 1](draft)}
            <div class="navrow">
              <button class="btn btn-ghost" data-action="previousStep">← Back</button>
              ${nextButton(step, draft)}
            </div>
          </div>
          <aside class="sticky">
            <div class="muted" style="font:600 12px Inter;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">Your trip card, live</div>
            ${shareCard({ ...draft, lead: draft.lead || 'Maya' }, { hideStatus: true })}
          </aside>
        </div>
      </div>
    </div>`;
};
