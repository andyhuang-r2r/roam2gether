import { renderScene } from '../scenes/index.js';
import { SEED_CREW } from '../data/crew.js';
import { header } from './components/header.js';
import { avatar } from './components/avatar.js';

const floatingChip = (person, text, position) =>
  `<div class="pop" style="${position}">${avatar(person, 'sm')}<span><b>${person.name}</b> picked<br>${text}</span></div>`;

const heroCollage = () => {
  const [, jordan, priya, theo] = SEED_CREW;
  return `
    <div class="collage">
      <div class="big">
        ${renderScene('europe', 'lisbon')}
        <div class="ov">Lisbon + Cascais<div style="font:500 14px Roboto;opacity:.9">92% match for your group</div></div>
      </div>
      ${floatingChip(jordan, 'Mountains', 'left:-4px;top:30px;--r:-3deg')}
      ${floatingChip(priya, 'Asia', 'right:-6px;top:110px;animation-delay:-1.5s;--r:2deg')}
      ${floatingChip(theo, 'Fancy hotel', 'left:-8px;bottom:150px;animation-delay:-3s;--r:2deg')}
      <div class="pop" style="right:20px;bottom:20px;animation-delay:-2s">
        <span style="color:var(--plane)">●</span><b>~3 spreadsheets avoided</b>
      </div>
    </div>`;
};

const problemSection = () => `
  <div style="background:var(--card)">
    <div class="wrap sec">
      <div class="two">
        <div>
          <span class="eyebrow">The problem</span>
          <h2>One person becomes the unpaid travel agent.</h2>
          <p class="muted" style="font-size:18px">You know the group chat. Everyone has opinions; nobody has a spreadsheet.
            roam2gether gets every opinion in two minutes, then shows where the group overlaps — and where it doesn’t.</p>
        </div>
        <div class="chat">
          <div class="bub"><small>Maya</small>ok so… where does everyone want to go?</div>
          <div class="bub"><small>Jordan</small>idk anywhere!! mountains maybe</div>
          <div class="bub"><small>Priya</small>somewhere with noodles pls</div>
          <div class="bub"><small>Theo</small>not too far. and a nice bed</div>
          <div class="bub me"><small>Maya</small>cool I’ll make a spreadsheet 🙃</div>
        </div>
      </div>
    </div>
  </div>`;

const howItWorks = () => `
  <div class="wrap sec">
    <span class="eyebrow">How it works</span>
    <h2>Three steps. Zero spreadsheets.</h2>
    <div class="grid3" style="margin-top:18px">
      <div class="card"><div class="step-n">1</div><h3>You set the basics</h3><p class="muted">Who, from where, when, rough budget. About a minute.</p></div>
      <div class="card"><div class="step-n">2</div><h3>Everyone plays</h3><p class="muted">Ten tiny “this or that” dilemmas, a few quick details, one optional secret wish.</p></div>
      <div class="card"><div class="step-n">3</div><h3>roam2gether finds the middle ground</h3><p class="muted">Where you agree, where you don’t, and destinations that suit the whole group.</p></div>
    </div>
    <div style="text-align:center;margin-top:38px"><button class="btn btn-pink" data-action="startTrip">Start a group trip</button></div>
  </div>`;

export const landingView = () => `
  <div class="screen">
    ${header()}
    <div class="wrap">
      <section class="hero">
        <div>
          <span class="eyebrow">New · roam2gether group planning</span>
          <h1>Plan a trip everyone <em>actually</em> wants to go on.</h1>
          <p class="sub">Invite your people, discover what they want, and let roam2gether find the middle ground.</p>
          <div class="cta">
            <button class="btn btn-pink" data-action="startTrip">Start a group trip →</button>
            <button class="btn btn-ghost" data-action="viewFinishedTrip">See a finished trip</button>
            <button class="navlink" data-action="planTrip">Plan your trip →</button>
          </div>
          <p class="muted" style="margin-top:18px;font-size:14px">The group holiday planner that stops one person becoming the unpaid travel agent.</p>
        </div>
        ${heroCollage()}
      </section>
    </div>
    ${problemSection()}
    ${howItWorks()}
    <div class="wrap"><div class="foot">Rome2Rio hackathon prototype · mocked data, no real routing or AI calls.</div></div>
  </div>`;
