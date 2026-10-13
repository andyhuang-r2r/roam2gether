/**
 * The named sections of the planner, in display order.
 *
 *  id        key used in `plan.items`, `plan.notes`, the active tab
 *  tab       short label for the tab bar
 *  mode      transport colour for the section icon (if any)
 *  emoji     icon when there is no transport mode
 *  isAi      shows the "AI" tag
 */
export const PLAN_SECTIONS = [
  {
    id: 'when',
    tab: 'When',
    title: 'When we’re going',
    emoji: '🗓️',
    subtitle: 'Pick the sweet spot for weather, crowds and price',
  },
  { id: 'stay', tab: 'Accommodation', title: 'Accommodation', mode: 'hotel', subtitle: 'Where the group sleeps' },
  { id: 'do', tab: 'Things to do', title: 'Things to do', emoji: '✨', subtitle: 'The stuff you’ll talk about later' },
  {
    id: 'eat',
    tab: 'Places to eat',
    title: 'Places to eat',
    emoji: '🍜',
    subtitle: 'Because food is the common thread',
  },
  {
    id: 'move',
    tab: 'Getting around',
    title: 'Getting around',
    mode: 'train',
    subtitle: 'Trains, buses and ferries between the bits',
  },
  {
    id: 'days',
    tab: 'Day by day',
    title: 'Day by day',
    mode: 'days',
    subtitle: 'roam2gether builds it from what you’ve added',
    isAi: true,
  },
];

/** Sections whose content is a list of cards people add and vote on. */
export const LIST_SECTIONS = ['stay', 'do', 'eat', 'move'];

export const SECTION_LABELS = {
  eat: 'Places to eat',
  do: 'Things to do',
  stay: 'Accommodation',
  move: 'Getting around',
};

/** Example places to try in the AI "paste a place" bar. */
export const PLACE_EXAMPLES = {
  default: ['Time Out Market', 'Pastéis de Belém', 'Pena Palace Sintra'],
  penang: ['Gurney Drive hawker', 'Kek Lok Si temple'],
  valencia: ['Mercado Central', 'City of Arts and Sciences'],
  tokyo: ['Tokyo Disneyland', 'Tsukiji Outer Market', 'Fushimi Inari'],
};

/** The teammates who "join" the simulated live session. */
export const SIMULATED_TEAMMATES = ['Jordan', 'Priya', 'Theo'];
