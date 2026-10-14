import { state, ui } from '../../state/store.js';
import { activeDestinationId, planKey } from '../../logic/planner.js';

const HIDDEN_ON = ['quiz', 'loading'];

/** Plan page only: pretend a fare dropped to show off the price alert. */
const priceDropButton = () => {
  if (state.route !== 'plan') return '';
  const hasDropped = state.plans?.[planKey(activeDestinationId())]?.priceAlert?.simulatedDrop;
  return `<button data-action="toggleSimulatedDrop">${hasDropped ? '↺ Reset flight price' : '📉 Simulate a flight price drop'}</button>`;
};

/** Floating presenter menu to jump between screens. */
export const demoNav = () => {
  if (HIDDEN_ON.includes(state.route)) return '';
  const jump = (route, label) => `<button data-action="jumpTo" data-value="${route}">${label}</button>`;
  return `
    <div class="demo ${ui.demoMenuOpen ? 'open' : ''}">
      <button data-action="toggleDemoMenu">🎬 Demo</button>
      <div class="pop2">
        ${jump('landing', '1 · Landing')}
        ${jump('setup', '2 · Trip setup')}
        ${jump('invite', '3 · Invite')}
        ${jump('join', '4 · Participant welcome')}
        ${jump('quiz', '5 · The 10 dilemmas')}
        ${jump('results', '6 · Group results')}
        ${jump('plan', '7 · Plan your trip')}
        ${priceDropButton()}
        <hr>
        <button data-action="resetPrototype">↺ Reset prototype</button>
      </div>
    </div>`;
};
