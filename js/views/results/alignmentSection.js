import { avatar } from '../components/avatar.js';

/** Two-colour split bar: left share in pink, right in charcoal. */
const splitBar = (leftPercent, leftLabel, rightLabel) => `
  <div class="sbar"><i class="l" style="width:${leftPercent}%"></i><i class="r" style="width:${100 - leftPercent}%"></i></div>
  <div class="sbl"><span>${leftLabel}</span><span>${rightLabel}</span></div>`;

const percent = (share) => Math.round(share * 100);

const climateCard = (stats) => `
  <div class="acard">
    <div class="t"><b>Climate</b><span class="tag ${stats.warmShare >= 0.7 ? 'pink' : ''}">${stats.warmShare >= 0.7 ? 'Strong overlap' : 'Mixed'}</span></div>
    <div class="big">${percent(stats.warmShare)}% sun</div>
    ${splitBar(percent(stats.warmShare), 'Sun & beach', 'Snow & peaks')}
    <div class="cap">${stats.snowCount === 0 ? 'Nobody picked snow.' : `${stats.snowCount} of ${stats.count} picked snow.`}</div>
  </div>`;

const regionCard = (stats) => {
  const europeans = stats.members.filter((p) => p.answers[1] === 0);
  const asians = stats.members.filter((p) => p.answers[1] === 1);
  const isSplit = Math.abs(stats.europeShare - 0.5) < 0.15;
  return `
    <div class="acard">
      <div class="t"><b>Region</b><span class="tag">${isSplit ? 'Split' : 'Leaning'}</span></div>
      <div class="big">${percent(stats.europeShare)}% Europe / ${percent(1 - stats.europeShare)}% Asia</div>
      ${splitBar(percent(stats.europeShare), 'Europe', 'Asia')}
      <div class="cluster"><div>${europeans.map((p) => avatar(p)).join('')}</div><div>${asians.map((p) => avatar(p)).join('')}</div></div>
    </div>`;
};

const paceCard = (stats) => {
  const isEven = stats.relaxedShare >= 0.4 && stats.relaxedShare <= 0.6;
  const label = isEven ? 'Evenly split' : stats.relaxedShare > 0.6 ? 'Mostly relaxed' : 'Mostly packed';
  return `
    <div class="acard">
      <div class="t"><b>Pace</b><span class="tag ink">${label}</span></div>
      <div class="big">${percent(stats.relaxedShare)}% relaxed / ${percent(1 - stats.relaxedShare)}% packed</div>
      ${splitBar(percent(stats.relaxedShare), 'Relaxed', 'Packed')}
      <div class="cap">${stats.slowMorningCount} of ${stats.count} love a slow morning; ${stats.lateNightCount} want late nights.</div>
    </div>`;
};

const reachMessage = (stats) => {
  if (stats.reach.any >= stats.count / 2) return 'Most of you are happy to go far — the map is wide open.';
  if (stats.reach.close >= stats.count / 2) return 'Keep it close: most of the crew wants a short trip there.';
  return 'Medium-haul is acceptable, but keep travel time sensible.';
};

const practicalFitCard = (stats) => {
  const biggest = Math.max(...Object.values(stats.reach));
  const column = ([key, label]) => `
    <div class="${stats.reach[key] === biggest ? 'hi' : ''}">
      <b style="font-family:Inter">${label}</b>
      <div style="display:flex;justify-content:center">
        ${stats.members
          .filter((p) => (p.reach || 'medium') === key)
          .map((p) => avatar(p, 'sm'))
          .join('')}
      </div>
    </div>`;
  return `
    <div class="acard">
      <div class="t"><b>Practical fit</b><span class="tag pink">Travel time</span></div>
      <div class="reach">${[
        ['close', 'Keep it close'],
        ['medium', 'Medium-haul'],
        ['any', 'Anywhere'],
      ]
        .map(column)
        .join('')}</div>
      <div class="cap">${reachMessage(stats)}</div>
    </div>`;
};

const styleCard = (stats) => {
  const themes = [
    ['Food-led', 100],
    ['City buzz', percent(stats.cityShare)],
    ['Boutique stays', percent(stats.boutiqueShare)],
    ['Beach days', percent(stats.beachShare)],
    ['Hidden gems', percent(stats.hiddenGemShare)],
    ['Multi-stop', percent(stats.multiBaseCount / stats.count)],
  ];
  return `
    <div class="acard w">
      <div class="t"><b>Style</b><span class="tag pink">Strong food, city, beach &amp; boutique themes</span></div>
      ${themes
        .map(
          ([name, value]) =>
            `<div class="theme"><span>${name}</span><div class="tb2"><i style="width:${value}%"></i></div><em>${value}%</em></div>`,
        )
        .join('')}
    </div>`;
};

/** "Where you align" — visual bars and clusters, not raw scores. */
export const alignmentSection = (stats) => `
  <h2 class="h2">Where you align</h2>
  <p class="h2sub">Not raw scores — what the crew actually has in common.</p>
  <div class="align">
    ${climateCard(stats)}${regionCard(stats)}${paceCard(stats)}${practicalFitCard(stats)}${styleCard(stats)}
  </div>`;
