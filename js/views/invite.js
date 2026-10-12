import { state } from '../state/store.js';
import { esc } from '../lib/utils.js';
import { crewSize, getCrew } from '../logic/crew.js';
import { header } from './components/header.js';
import { avatar } from './components/avatar.js';
import { shareCard } from './components/shareCard.js';
import { toolbox } from './components/toolbox.js';

const SHARE_LINK = 'rome2rio.com/roam2gether/j/maya-30th-k7x2';

const personRow = (person) => {
  const subtitle = person.isLead ? 'Trip Lead' : person.isLate ? 'Late arrival' : 'Invited';
  const status = person.done
    ? '<span class="pill done">Had their say</span>'
    : `<span class="pill">Waiting</span>
       <button class="btn btn-ghost btn-sm" data-action="openNudge" data-value="${esc(person.name)}">Nudge</button>`;
  return `
    <div class="person">
      ${avatar(person)}
      <div style="flex:1">
        <b style="font-family:Inter">${esc(person.name)}</b>${person.isMe && !state.me.done ? ' <span class="muted">(that’s you in the preview)</span>' : ''}
        <div class="muted" style="font-size:13px">${subtitle}</div>
      </div>
      ${status}
    </div>`;
};

const emailRow = (maskedEmail) => `
  <div class="person">
    <span class="av" style="background:#bbb">✉</span>
    <div style="flex:1"><b style="font-family:Inter">${esc(maskedEmail)}</b><div class="muted" style="font-size:13px">Email invite</div></div>
    <span class="pill">Sent</span>
  </div>`;

export const inviteView = () => {
  const crew = getCrew();
  const doneCount = crew.filter((p) => p.done).length;
  return `
    <div class="screen">
      ${header()}
      <div class="wrap">
        <div class="invgrid">
          <div>${shareCard(state.trip)}</div>
          <div>
            <span class="eyebrow">Trip created</span>
            <h1 style="font-size:clamp(28px,4vw,40px);margin:8px 0 6px">Now invite the group.</h1>
            <p class="muted" style="margin-bottom:20px">One link. They tap, play ten tiny dilemmas, and that’s it. No account, no spreadsheet.</p>

            <div class="linkbox"><span>${SHARE_LINK}</span><button class="btn btn-ink btn-sm" data-action="copyInviteLink">Copy link</button></div>
            <div class="linkbox" style="margin-top:10px;padding-left:6px">
              <input class="input" id="inviteEmail" placeholder="Invite by email (visual only)" style="border:0;height:40px;background:transparent">
              <button class="btn btn-ghost btn-sm" data-action="sendEmailInvite">Send invite</button>
            </div>

            <div style="margin-top:22px;display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-pink" data-action="viewGroupResults">View group results</button>
              <button class="btn btn-ghost" data-action="previewParticipant">Preview participant experience</button>
            </div>

            <div class="card white" style="margin-top:24px">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <h3>The group</h3><span class="pill done">${doneCount} of ${crewSize()} in</span>
              </div>
              ${crew.map(personRow).join('')}
              ${state.invitedEmails.map(emailRow).join('')}
            </div>
            <div style="margin-top:20px">${toolbox()}</div>
          </div>
        </div>
      </div>
    </div>`;
};
