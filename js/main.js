/**
 * Entry point: wire views, actions and hooks together, then start the app.
 *
 * Where things live
 *   data/      static content (questions, destinations, plan suggestions)
 *   state/     the saved `state` and the transient `ui` object
 *   logic/     scoring, crew stats, planner helpers (no HTML)
 *   views/     functions that return HTML strings (one per screen)
 *   actions/   click handlers, named by the `data-action` they serve
 *   render.js  draw the current screen   events.js  global event wiring
 */
import { state, ui, saveState } from './state/store.js';
import { ROUTES, registerAfterRender, registerModalRenderer, registerViews, render, closeModal } from './render.js';
import { initEvents, onKey, registerActions, registerInputHandlers, runAction } from './events.js';
import { clamp, deepClone } from './lib/utils.js';

import { landingView } from './views/landing.js';
import { setupView, originSuggestionsHtml } from './views/setup.js';
import { inviteView } from './views/invite.js';
import { joinView } from './views/join.js';
import { quizView } from './views/quiz.js';
import { miniResultView } from './views/mini.js';
import { detailsView } from './views/details.js';
import { loadingView, LOADING_MESSAGES } from './views/loading.js';
import { resultsView } from './views/results/resultsPage.js';
import { planView } from './views/plan/planPage.js';
import { modalView } from './views/modals.js';
import { demoNav } from './views/components/demoNav.js';

import { navigationActions } from './actions/navigation.js';
import { setupActions } from './actions/setup.js';
import { quizActions } from './actions/quiz.js';
import { resultsActions } from './actions/results.js';
import { planActions } from './actions/plan.js';
import { startPlanSimulation } from './actions/planSimulation.js';

import { getCrew } from './logic/crew.js';
import { buildContext, rankDestinations } from './logic/scoring.js';
import { DESTINATIONS, getDestination } from './data/destinations.js';
import { ensurePlan } from './logic/planner.js';
import { navigate } from './render.js';

/* ---------- screens ---------- */

/** Wrap a view so the floating demo menu is added to every screen. */
const withDemoNav = (view) => () => view() + demoNav();

/** The planner always has a valid destination and plan before it draws. */
const planScreen = () => {
  const fallbackId = rankDestinations(getCrew(), buildContext())[0]?.destination.id ?? DESTINATIONS[0].id;
  const destination = getDestination(state.planDestinationId ?? fallbackId);
  state.planDestinationId = destination.id;
  ensurePlan(destination);
  return planView();
};

/** The setup screen edits a copy of the trip so "back" never loses the original. */
const setupScreen = () => {
  state.draft ??= deepClone(state.trip);
  return setupView();
};

registerViews({
  landing: withDemoNav(landingView),
  setup: withDemoNav(setupScreen),
  invite: withDemoNav(inviteView),
  join: withDemoNav(joinView),
  quiz: withDemoNav(quizView),
  mini: withDemoNav(miniResultView),
  details: withDemoNav(detailsView),
  loading: withDemoNav(loadingView),
  results: withDemoNav(resultsView),
  plan: withDemoNav(planScreen),
});

registerModalRenderer(modalView);

registerActions({
  ...navigationActions,
  ...setupActions,
  ...quizActions,
  ...resultsActions,
  ...planActions,
});

/* ---------- things that happen right after a screen is drawn ---------- */

const LOADING_STEP_MS = 640;

/** Cycle the loading messages, then show the results. */
const runLoadingScreen = () => {
  if (ui.loadingTimer) return;
  const messages = LOADING_MESSAGES(getCrew().length);
  let step = 0;
  const tick = () => {
    const messageEl = document.querySelector('#loadingMessage');
    const barEl = document.querySelector('#loadingBar');
    if (!messageEl) {
      ui.loadingTimer = null; // the user left the screen
      return;
    }
    step += 1;
    if (step >= messages.length) {
      ui.loadingTimer = null;
      navigate('results');
      return;
    }
    messageEl.textContent = messages[step];
    barEl.style.width = `${6 + (step / (messages.length - 1)) * 94}%`;
    ui.loadingTimer = setTimeout(tick, LOADING_STEP_MS);
  };
  setTimeout(() => {
    const barEl = document.querySelector('#loadingBar');
    if (barEl) barEl.style.width = '14%';
  }, 50);
  ui.loadingTimer = setTimeout(tick, LOADING_STEP_MS);
};

registerAfterRender({
  mini: () =>
    setTimeout(() => {
      document.querySelectorAll('#personalityBar [data-grow]').forEach((bar) => {
        bar.style.flex = bar.dataset.grow;
      });
    }, 60),
  details: () => {
    const textarea = document.querySelector('#followUpText');
    if (textarea) setTimeout(() => textarea.focus({ preventScroll: true }), 350);
  },
  loading: runLoadingScreen,
  plan: startPlanSimulation,
});

/* ---------- inputs and keys ---------- */

const showOriginSuggestions = (el) => {
  const list = document.querySelector(`#originSuggestions${el.dataset.index}`);
  if (!list) return;
  list.innerHTML = originSuggestionsHtml(Number(el.dataset.index), el.value);
  list.classList.toggle('open', list.children.length > 0);
};

let savedIndicatorTimer;
/** "Saving…" → "All changes saved" while typing in the planner. */
const flashSavedIndicator = (event) => {
  if (!event.target.dataset?.bind?.startsWith('plans.')) return;
  const indicator = document.querySelector('#savedIndicator');
  if (!indicator) return;
  indicator.textContent = 'Saving…';
  clearTimeout(savedIndicatorTimer);
  savedIndicatorTimer = setTimeout(() => {
    indicator.textContent = '✓ All changes saved';
  }, 700);
};

registerInputHandlers({
  origin: {
    input: (el) => {
      state.draft.origins[Number(el.dataset.index)] = el.value;
      saveState();
      showOriginSuggestions(el);
    },
    focus: showOriginSuggestions,
    blur: () =>
      setTimeout(() => document.querySelectorAll('.ac-list').forEach((list) => list.classList.remove('open')), 180),
  },
  smartAdd: {
    input: (el) => {
      ui.scaffoldText = el.value;
    },
    enter: () => runAction('scaffoldPlace'),
  },
});

document.addEventListener('input', flashSavedIndicator);

/** Quiz: ← / → pick the left / right card. Escape closes any dialog. */
onKey((event) => {
  if (state.route === 'quiz' && !ui.modal) {
    const cards = document.querySelectorAll('.qcard');
    if (event.key === 'ArrowLeft') cards[0]?.click();
    if (event.key === 'ArrowRight') cards[1]?.click();
  }
  if (event.key === 'Escape' && ui.modal) closeModal();
  else if (event.key === 'Escape' && ui.activityOpen) runAction('closeActivity');
});

/* ---------- start ---------- */

/** ES modules don't load from file:// — explain instead of showing a blank page. */
const showFileProtocolHelp = () => {
  document.querySelector('#app').innerHTML = `
    <div style="max-width:560px;margin:80px auto;padding:0 24px;font-family:Roboto,sans-serif">
      <h1 style="font-family:Inter,sans-serif">Run roam2gether from a local server</h1>
      <p>Browsers block ES modules on <code>file://</code> pages. In this folder run:</p>
      <pre style="background:#f4f1ee;padding:14px;border-radius:12px">npm start</pre>
      <p>(or <code>python3 -m http.server 8080</code>) and open the address it prints.</p>
    </div>`;
};

const boot = () => {
  if (window.location.protocol === 'file:') return showFileProtocolHelp();

  const hashRoute = window.location.hash.replace('#/', '');
  if (ROUTES.includes(hashRoute)) state.route = hashRoute;
  if (!ROUTES.includes(state.route)) state.route = 'landing';
  state.me.questionIndex = clamp(state.me.questionIndex ?? 0, 0, 9);

  initEvents();
  render();
  return window.history.replaceState(null, '', `#/${state.route}`);
};

boot();
