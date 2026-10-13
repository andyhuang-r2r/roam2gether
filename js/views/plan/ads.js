/**
 * Sponsored cards, one per planner section. Copy is generated from the
 * destination so each ad looks like it was targeted at this trip.
 */
import { esc } from '../../lib/utils.js';

/** Offers tailored to a specific destination, ahead of the generic copy. */
const DESTINATION_ADS = {
  tokyo: {
    do: {
      headline: 'Skip the queues at Tokyo Disneyland',
      subline: 'Add an Express line pass: priority entry to the biggest rides, same-day booking',
      cta: 'Get Express line',
    },
  },
};

const adCopy = (sectionId, city, destination) =>
  DESTINATION_ADS[destination.id]?.[sectionId] ??
  ({
    when: {
      headline: `Flexible on dates? Find the cheapest weeks to fly to ${city}`,
      subline: 'Compare fares across the whole month in one view',
      cta: 'Compare fares',
    },
    stay: {
      headline: `${city}: stay 4–6 nights from ${destination.costLevel > 2 ? '$$$' : '$$'}`,
      subline: 'Free cancellation on most rooms',
      cta: 'See deals',
    },
    do: {
      headline: `Skip-the-line tickets in ${city}`,
      subline: 'Instant confirmation on your phone',
      cta: 'See deals',
    },
    eat: {
      headline: `Reserve a table in ${city}'s top-rated restaurants`,
      subline: 'Free to book · tables for the whole group',
      cta: 'Reserve now',
    },
    move: {
      headline: `${city} transfers & rail passes, sorted`,
      subline: 'Airport pick-ups and day-trip tickets in one place',
      cta: 'See options',
    },
    days: {
      headline: `Book your whole ${city} itinerary in one go`,
      subline: 'Tickets, transfers and stays for every day',
      cta: 'Book the trip',
    },
  })[sectionId];

/** Card version for the suggestion grids. `wide` stretches it across the section. */
export const sectionAd = (sectionId, destination, { wide = false } = {}) => {
  const copy = adCopy(sectionId, destination.name.split(' +')[0], destination);
  return `
    <div class="scard ad ${wide ? 'wide' : ''}">
      <span class="adtag">Ad · based on your trip</span>
      <b>${esc(copy.headline)}</b>
      <p class="idesc">${esc(copy.subline)}</p>
      <button class="btn btn-ink btn-sm" data-action="openAd">${esc(copy.cta)}</button>
    </div>`;
};
