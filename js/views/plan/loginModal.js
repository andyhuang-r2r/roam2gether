import { state } from '../../state/store.js';
import { esc } from '../../lib/utils.js';
import { sheet } from '../components/sheet.js';

/** Mock login — nothing is stored beyond the browser. */
export const loginModal = () =>
  sheet(`
    <span class="eyebrow">Free account</span>
    <h2 style="margin:6px 0 6px">Log in to plan together</h2>
    <p class="muted" style="margin-bottom:16px">Your plan, price alerts and crew stay saved to your account — and everyone you invite signs in to edit.</p>
    <button class="btn btn-ink btn-block" data-action="logIn" data-value="google" style="margin-bottom:10px">Continue with Google</button>
    <div class="muted" style="text-align:center;font-size:13px;margin:8px 0">or with email</div>
    <input class="input" id="loginName" placeholder="Your name" value="${esc(state.me.name === 'Sam' ? 'Maya' : state.me.name)}" style="margin-bottom:10px">
    <input class="input" id="loginEmail" placeholder="you@email.com" value="${esc(state.user?.email ?? '')}" style="margin-bottom:14px">
    <button class="btn btn-pink btn-block" data-action="logIn">Continue</button>
    <p class="muted" style="font-size:12px;margin-top:12px;text-align:center">Prototype: no real account is created.</p>`);
