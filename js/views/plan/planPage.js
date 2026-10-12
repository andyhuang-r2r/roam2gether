/**
 * The collaborative "Plan your trip" page.
 *
 * Top to bottom: the trip card (introduces the trip and flows straight into
 * the flight prices), the "paste a place" bar, then one tab per section.
 * Activity slides in from the right.
 */
import { state, ui } from '../../state/store.js';
import { esc } from '../../lib/utils.js';
import { PLAN_SECTIONS, LIST_SECTIONS } from '../../data/planSections.js';
import { renderScene } from '../../scenes/index.js';
import { describeTiming } from '../../logic/tripSummary.js';
import { crewSize, getCrew } from '../../logic/crew.js';
import { currentDestination, currentPlan, currentUserName } from '../../logic/planner.js';
import { header } from '../components/header.js';
import { avatarFor, presenceAvatar } from '../components/avatar.js';
import { listSection } from './listSection.js';
import { whenSection } from './whenSection.js';
import { flightsSection } from './flightsSection.js';
import { daysSection } from './daysSection.js';
import { smartAddBar } from './smartAddBar.js';

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
      <div class="trip-bridge">
        <span class="trip-bridge-icon">✈</span>
        <div><b>Flights decide whether this trip happens.</b>
          <span class="muted"> Watch the fares to ${esc(city)} and set an alert before you book anything else.</span></div>
      </div>
      <div class="trip-flights">${flightsSection(plan, destination)}</div>
    </section>`;
};

/* ---------- tabs ---------- */

const tabBar = (plan) => `
  <div class="tabs" role="tablist">
    ${PLAN_SECTIONS.map((section) => {
      const count = LIST_SECTIONS.includes(section.id) ? plan.items[section.id].length : null;
      return `<button class="tab ${ui.planTab === section.id ? 'on' : ''}" role="tab" data-action="selectPlanTab" data-value="${section.id}">
        ${section.tab}${count ? ` <span class="pill">${count}</span>` : ''}${section.isAi ? ' <span class="aitag">AI</span>' : ''}</button>`;
    }).join('')}
  </div>`;

const tabBody = (sectionId, plan, destination) => {
  if (sectionId === 'when') return whenSection(plan, destination);
  if (sectionId === 'days') return daysSection(plan);
  return listSection(sectionId, plan, destination);
};

const noteBox = (sectionId, plan) => `
  <textarea class="note-in" data-bind="plans.${state.planDestinationId}.notes.${sectionId}" placeholder="Add a note for the crew…">${esc(plan.notes[sectionId] ?? '')}</textarea>`;

const activeTab = (plan, destination) => {
  const section = PLAN_SECTIONS.find((s) => s.id === ui.planTab) ?? PLAN_SECTIONS[0];
  return `
    <section class="psec">
      <div class="pbody">
        <p class="muted" style="margin-bottom:14px">${esc(section.subtitle)}</p>
        ${tabBody(section.id, plan, destination)}${noteBox(section.id, plan)}
      </div>
    </section>`;
};

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

export const planView = () => {
  const destination = currentDestination();
  const plan = currentPlan();
  return `
    <div class="${ui.planAnimate ? 'screen' : ''}">
      ${header()}
      <div class="wrap plan">
        <main class="doc">
          ${tripCard(plan, destination)}
          ${smartAddBar(destination)}
          ${tabBar(plan)}
          ${activeTab(plan, destination)}
        </main>
      </div>
      ${activityPanel(plan)}
    </div>`;
};
