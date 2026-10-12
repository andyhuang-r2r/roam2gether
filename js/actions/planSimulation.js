/**
 * Simulated live collaboration: a few seconds after the planner opens,
 * teammates "join" and add things, so the page feels shared.
 * Runs once per plan; every step checks the user hasn't left.
 */
import { state, ui, saveState } from '../state/store.js';
import { render } from '../render.js';
import { showToast } from '../lib/toast.js';
import { getPlanContent } from '../data/planContent.js';
import { currentDestination, currentPlan, logActivity, makeItem } from '../logic/planner.js';

/** Redraw unless the user is typing (so we don't steal focus). */
const redrawUnlessTyping = () => {
  if (/INPUT|TEXTAREA/.test(document.activeElement?.tagName ?? '')) return;
  render();
};

/** Add a suggestion on behalf of a teammate (if it isn't already there). */
const addFor = (plan, who, sectionId, suggestion) => {
  if (!suggestion || plan.items[sectionId].some((item) => item.name === suggestion.name)) return;
  plan.items[sectionId].push(makeItem(sectionId, suggestion, who));
  logActivity(plan, who, `added “${suggestion.name}”`);
  showToast(`${who} added “${suggestion.name}”`);
};

export const startPlanSimulation = () => {
  ui.planAnimate = false;
  const plan = currentPlan();
  if (!plan || plan.simulationStarted) return;
  plan.simulationStarted = true;
  saveState();

  const destinationId = state.planDestinationId;
  const content = getPlanContent(currentDestination());

  const schedule = (delayMs, step) =>
    setTimeout(() => {
      if (state.route !== 'plan' || state.planDestinationId !== destinationId) return;
      step();
      saveState();
      redrawUnlessTyping();
    }, delayMs);

  schedule(3500, () => {
    plan.presence = [{ who: 'Jordan' }];
    logActivity(plan, 'Jordan', 'joined the plan');
    showToast('Jordan joined the plan');
  });
  schedule(7000, () => addFor(plan, 'Jordan', 'do', content.do[1]));
  schedule(11000, () => {
    plan.presence = [{ who: 'Jordan' }, { who: 'Priya' }];
    addFor(plan, 'Priya', 'eat', content.eat[1]);
  });
  schedule(16000, () => {
    plan.presence = [{ who: 'Theo' }, { who: 'Priya' }];
    const hotel = plan.items.stay[0];
    if (hotel && !hotel.votes.includes('Theo')) {
      hotel.votes.push('Theo');
      logActivity(plan, 'Theo', `voted for “${hotel.name}”`);
    }
  });
};
