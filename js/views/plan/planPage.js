/**
 * The collaborative "Plan your trip" page.
 *
 * Top to bottom: the trip card (introduces the trip and flows straight into
 * the flight prices), the "paste a place" bar, then every section stacked in order.
 * Activity slides in from the right.
 */
import { state, ui } from '../../state/store.js';
import { esc } from '../../lib/utils.js';
import { PLAN_SECTIONS, LIST_SECTIONS } from '../../data/planSections.js';
import { renderScene } from '../../scenes/index.js';
import { aiStar, transportIcon, TRANSPORT_COLORS } from '../../lib/icons.js';
import { describeTiming } from '../../logic/tripSummary.js';
import { crewSize, getCrew } from '../../logic/crew.js';
import { currentDestination, currentPlan, currentUserName } from '../../logic/planner.js';
import { header } from '../components/header.js';
import { avatarFor, presenceAvatar } from '../components/avatar.js';
import { listSection } from './listSection.js';
import { whenSection } from './whenSection.js';
import { flightsSection } from './flightsSection.js';
import { daysSection } from './daysSection.js';
import { addPlaceBar, addPlaceWidget } from './addPlaceBar.js';

/* ---------- header ---------- */

/** Everyone on the plan; a ring marks the people who are active right now. */
const collaboratorAvatars = (plan) => {
  const me = currentUserName();
  const teammates = getCrew()
    .filter((p) => !p.isLead && p.name !== me)
    .map((p) => p.name);
  const activeNames = new Set(plan.presence.map((p) => p.who));
  return `<div class="presence">
    ${presenceAvatar(me, true)}${teammates.map((name) => presenceAvatar(name, activeNames.has(name))).join('')}
  </div>`;
};

/**
 * The trip card: a scenic banner that introduces the trip, flowing straight
 * into the flight prices — fares decide whether the trip goes ahead.
 */
const tripCard = (plan, destination) => {
  const city = destination.name.split(' +')[0];
  return `
    <section class="trip-card">
      <div class="trip-hero">
        <div class="trip-scene">${renderScene(destination.scene, destination.sceneVariant)}<div class="trip-shade"></div></div>
        <div class="trip-top">
          <button class="trip-back" data-action="backToResults">← Back to results</button>
          <div class="trip-actions">
            ${collaboratorAvatars(plan)}
            <button class="btn btn-white btn-sm" data-action="openActivity">Activity <span class="pill">${plan.activity.length}</span></button>
            <button class="btn btn-pink btn-sm" data-action="openShare">Share</button>
          </div>
        </div>
        <div class="trip-intro">
          <span class="eyebrow trip-eyebrow">Your trip to ${esc(destination.country)}</span>
          <input class="titlein" data-bind="plans.${destination.id}.title" value="${esc(plan.title)}" aria-label="Trip name">
          <div class="trip-facts">
            <span>📍 ${esc(destination.name)}</span>
            <span>🗓️ ${esc(describeTiming(state.trip, { short: true }))}</span>
            <span>👥 ${crewSize()} travellers</span>
            <span id="savedIndicator" class="saved">✓ All changes saved</span>
          </div>
        </div>
      </div>
      <div class="trip-flights">${flightsSection(plan, destination)}</div>
    </section>`;
};

/* ---------- sections (stacked, no tabs) ---------- */

const sectionBody = (sectionId, plan, destination) => {
  if (sectionId === 'when') return whenSection(plan, destination);
  if (sectionId === 'days') return daysSection(plan);
  return listSection(sectionId, plan, destination);
};

const noteBox = (sectionId, plan) => `
  <textarea class="note-in" data-bind="plans.${state.planDestinationId}.notes.${sectionId}" placeholder="Add a note for the crew…">${esc(plan.notes[sectionId] ?? '')}</textarea>`;

const sectionIcon = (section) =>
  section.mode
    ? `<span class="sico" style="background:${TRANSPORT_COLORS[section.mode]}">${transportIcon(section.mode)}</span>`
    : `<span class="sico soft">${section.emoji}</span>`;

const planSection = (section, plan, destination) => {
  const count = LIST_SECTIONS.includes(section.id) ? plan.items[section.id].length : null;
  return `
    <section class="psec" id="sec-${section.id}">
      <div class="shead">
        ${sectionIcon(section)}
        <h2>${esc(section.title)}${count ? ` <span class="pill">${count}</span>` : ''}${section.isAi ? ` ${aiStar()}` : ''}</h2>
      </div>
      <div class="pbody">
        ${sectionBody(section.id, plan, destination)}${noteBox(section.id, plan)}
      </div>
    </section>`;
};

const allSections = (plan, destination) => PLAN_SECTIONS.map((section) => planSection(section, plan, destination)).join('');

/* ---------- activity slide-out ---------- */

const activityPanel = (plan) =>
  ui.activityOpen
    ? `<div class="activity-scrim" data-action="closeActivity"></div>
       <aside class="activity-panel" aria-label="Activity">
         <div class="activity-head"><h3>Activity</h3><button class="close" data-action="closeActivity" aria-label="Close">✕</button></div>
         ${plan.activity
           .map(
             (a) =>
               `<div class="act">${avatarFor(a.who, 'xs')}<span><b>${esc(a.who)}</b> ${esc(a.text)}<small>${esc(a.when)}</small></span></div>`,
           )
           .join('')}
       </aside>`
    : '';

/* ---------- floating "Plan for me" widget (a mini version of the bar) ---------- */

/** The widget only shows once the "Plan for me" bar has scrolled out of view. */
setInterval(() => {
  const fab = document.querySelector('#planFab');
  const bar = document.querySelector('#addPlaceBar');
  if (!fab || !bar) return;
  const { top, bottom } = bar.getBoundingClientRect();
  fab.classList.toggle('show', bottom < 0 || top > window.innerHeight);
}, 250);

export const planView = () => {
  const destination = currentDestination();
  const plan = currentPlan();
  return `
    <div class="${ui.planAnimate ? 'screen' : ''}">
      ${header()}
      <div class="wrap plan">
        <main class="doc">
          ${tripCard(plan, destination)}
          ${addPlaceBar(destination)}
          ${allSections(plan, destination)}
        </main>
      </div>
    </div>
    ${addPlaceWidget()}
    ${activityPanel(plan)}`;
};
