import { state } from '../../state/store.js';
import { cityName } from '../../data/cities.js';
import { esc } from '../../lib/utils.js';

/** Plain-English trade-offs, generated from the crew's stats and the trip. */
export const buildTakeaways = (stats, ranked) => {
  const { trip } = state;
  const takeaways = [];

  takeaways.push(
    `Your best overlap is a ${stats.warmShare >= 0.5 ? 'warm' : 'cool'}, food-led ${stats.cityShare >= 0.6 ? 'city' : 'base'} with an easy ${stats.beachShare >= 0.4 ? 'beach' : 'mountain'} or nature escape nearby.`,
  );

  const multiShare = stats.multiBaseCount / stats.count;
  takeaways.push(
    multiShare < 0.5
      ? `A two-centre trip may frustrate the slow-travel group — ${stats.singleBaseCount} of ${stats.count} want one perfect place. Pick a base and day-trip.`
      : `${stats.multiBaseCount} of ${stats.count} are up for a multi-stop trip, so a two-centre route is fair game.`,
  );

  if (trip.timing === 'locked') {
    takeaways.push(
      'Locked dates make Southern Europe ideal; if you were still dreaming, Southeast Asia would open up.',
    );
  } else if (trip.timing === 'rough') {
    takeaways.push(
      'With a rough window, both Southern Europe and Southeast Asia stay in play — lock the dates and Europe jumps ahead.',
    );
  } else {
    takeaways.push(
      'Locked dates would make Southern Europe ideal; the same group’s “Still dreaming” answers open up Southeast Asia.',
    );
  }

  // Vibes vs travel time between the top picks.
  const topThree = ranked.slice(0, 3);
  const fastest = topThree.reduce((best, r) => (r.hours < best.hours ? r : best));
  const best = ranked[0];
  if (best.hours - fastest.hours >= 5) {
    const short = (r) => r.destination.name.split(' +')[0];
    takeaways.push(
      `${short(best)} wins on vibes; ${short(fastest)} wins on travel time (~${Math.round(best.hours)}h vs ~${Math.round(fastest.hours)}h from ${esc(cityName(trip.origins[0] || 'Melbourne'))}). That’s your real trade-off.`,
    );
  }

  if (['family', 'bigfamily'].includes(trip.type) || trip.hasKids) {
    takeaways.push(
      'With kids in the mix, roam2gether is quietly favouring short transfers, flat walks and beach or pool time.',
    );
  }
  return takeaways;
};

export const takeSection = (takeaways) => `
  <h2 class="h2">roam2gether’s take</h2>
  <p class="h2sub">Trade-offs, in plain English.</p>
  <div class="take">
    ${takeaways.map((text, i) => `<div class="t ${i % 2 ? 'alt' : ''}"><i>${i + 1}</i><span>${text}</span></div>`).join('')}
  </div>`;
