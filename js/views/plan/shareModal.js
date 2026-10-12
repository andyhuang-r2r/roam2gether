import { state } from '../../state/store.js';
import { esc } from '../../lib/utils.js';
import { getCrew } from '../../logic/crew.js';
import { currentPlan, currentUserName } from '../../logic/planner.js';
import { avatarFor } from '../components/avatar.js';
import { sheet } from '../components/sheet.js';

export const planShareLink = () => `rome2rio.com/plan/${state.planDestinationId}-k7x2`;

const collaboratorRow = ({ name, role }) => `
  <div class="person" style="padding:8px 0">
    ${avatarFor(name, 'sm')}<b style="font-family:Inter;flex:1">${esc(name)}</b><span class="pill">${role}</span>
  </div>`;

/** "Share this plan" — copy link, link-access toggle, invite by email. */
export const shareModal = () => {
  const plan = currentPlan();
  const collaborators = [
    { name: currentUserName(), role: 'Owner' },
    ...getCrew()
      .filter((p) => !p.isLead && !p.isLate)
      .map((p) => ({ name: p.name, role: 'Editor' })),
  ];
  return sheet(`
    <h2>Share this plan</h2>
    <p class="muted" style="margin-bottom:14px">Anyone you invite can add ideas, vote and edit — like a shared doc.</p>
    <div class="linkbox"><span>${esc(planShareLink())}</span><button class="btn btn-ink btn-sm" data-action="copyPlanLink">Copy link</button></div>
    <div style="display:flex;align-items:center;gap:12px;margin:16px 0">
      <button class="switch ${plan.linkSharing ? 'on' : ''}" data-action="togglePlanLinkSharing" aria-label="Link access"><i></i></button>
      <div><b style="font-family:Inter">Anyone with the link can edit</b><div class="muted" style="font-size:13px">They’ll be asked to log in first.</div></div>
    </div>
    <div class="linkbox" style="padding-left:6px">
      <input class="input" id="planInviteEmail" placeholder="Invite by email" style="border:0;height:40px;background:transparent">
      <button class="btn btn-ghost btn-sm" data-action="invitePlanCollaborator">Invite</button>
    </div>
    <div style="margin-top:16px">${collaborators.map(collaboratorRow).join('')}</div>`);
};
