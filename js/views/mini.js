import { state } from '../state/store.js';
import { esc } from '../lib/utils.js';
import { getSeed } from '../data/crew.js';
import { pickArchetypes } from '../logic/personality.js';
import { header } from './components/header.js';

/** Playful result shown right after the tenth dilemma. */
export const miniResultView = () => {
  const answers = state.me.answers.length === 10 ? state.me.answers : getSeed('sam').answers;
  const archetypes = pickArchetypes(answers);
  const sentence = `You are ${archetypes[0].percent}% ${archetypes[0].name}, ${archetypes[1].percent}% ${archetypes[1].name}, and ${archetypes[2].percent}% ${archetypes[2].name}.`;
  return `
    <div class="screen">
      ${header()}
      <div class="mini">
        <span class="eyebrow">Your tiny travel personality</span>
        <h1>${esc(sentence)}</h1>
        <div class="stack" id="personalityBar">
          ${archetypes.map((a) => `<div style="background:${a.color}" data-grow="${a.percent}">${a.percent}%</div>`).join('')}
        </div>
        <div class="legend">
          ${archetypes.map((a) => `<div><i style="background:${a.color}"></i>${esc(a.name)}</div>`).join('')}
        </div>
        ${
          state.cousins.takingQuiz
            ? '<button class="btn btn-pink btn-block" data-action="finishCousinsQuiz">Back to my trips →</button>'
            : '<button class="btn btn-pink btn-block" data-action="startFollowUps">A few quick details →</button>'
        }
        <p style="margin-top:14px"><button class="link muted" data-action="redoQuiz">Change an answer</button></p>
      </div>
    </div>`;
};
