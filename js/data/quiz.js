/**
 * The ten "this or that" dilemmas.
 * Each option has a `scene` key that maps to an illustration in `scenes/`.
 */

export const QUIZ_QUESTIONS = [
  {
    hint: 'Gut feeling only.',
    optionA: { label: 'Sun on your face', sub: 'Golden hour, salty hair', scene: 'sun' },
    optionB: { label: 'Snow under your boots', sub: 'Squeaky snow, hot chocolate', scene: 'snow' },
  },
  {
    hint: 'Pick a side of the map.',
    optionA: { label: 'Europe', sub: 'Old towns and espresso', scene: 'europe' },
    optionB: { label: 'Asia', sub: 'Night markets and neon', scene: 'asia' },
  },
  {
    hint: 'Energy check.',
    optionA: { label: 'City buzz', sub: 'Rooftops, queues worth joining', scene: 'city' },
    optionB: { label: 'Wild escape', sub: 'Signal optional', scene: 'wild' },
  },
  {
    hint: 'Postcard time.',
    optionA: { label: 'Beach all day', sub: 'Towel. Book. Repeat.', scene: 'beach' },
    optionB: { label: 'Mountains all day', sub: 'Boots on, views earned', scene: 'mountain' },
  },
  {
    hint: 'Your body clock, honestly.',
    optionA: { label: 'Slow mornings', sub: 'Coffee that takes an hour', scene: 'slow' },
    optionB: { label: 'Late nights', sub: 'Who needs sleep?', scene: 'late' },
  },
  {
    hint: 'Dinner, but make it a personality.',
    optionA: { label: 'Street-food chaos', sub: 'Point, pay, devour', scene: 'street' },
    optionB: { label: 'Long-table dinners', sub: 'Three hours and a second dessert', scene: 'table' },
  },
  {
    hint: 'How do you hold a plan?',
    optionA: { label: 'Packed itinerary', sub: 'Every hour accounted for', scene: 'packed' },
    optionB: { label: 'See where the day goes', sub: 'Plans are more of a vibe', scene: 'flex' },
  },
  {
    hint: 'Where do you lay your head?',
    optionA: { label: 'Boutique hotel', sub: 'Good soap, better lobby', scene: 'boutique' },
    optionB: { label: 'Cabin, riad or somewhere with a story', sub: 'Creaky, charming, memorable', scene: 'riad' },
  },
  {
    hint: 'Commitment issues?',
    optionA: { label: 'One perfect place', sub: 'Unpack once, properly', scene: 'one' },
    optionB: { label: 'Three places in one trip', sub: 'Plane, train, ferry, repeat', scene: 'three' },
  },
  {
    hint: 'Last one. How adventurous?',
    optionA: { label: 'Postcard classics', sub: 'The famous bits are famous for a reason', scene: 'classic' },
    optionB: { label: '“How did you find this?”', sub: 'Down the alley, up the stairs', scene: 'hidden' },
  },
];

export const QUESTION_COUNT = QUIZ_QUESTIONS.length;

/**
 * Which destination trait each answer maps to: [traitIfA, traitIfB].
 * An answer is stored as 0 (option A) or 1 (option B).
 */
export const QUESTION_TRAITS = [
  ['warm', 'snow'],
  ['europe', 'asia'],
  ['city', 'wild'],
  ['beach', 'mountain'],
  ['slow', 'late'],
  ['street', 'table'],
  ['packed', 'flex'],
  ['boutique', 'story'],
  ['one', 'three'],
  ['classic', 'hidden'],
];

/** How much each question matters when scoring a destination. */
export const QUESTION_WEIGHTS = [1.3, 1.3, 1, 1, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8];

/** Named indexes so the scoring code reads like English. */
export const Q = {
  CLIMATE: 0,
  REGION: 1,
  SETTING: 2,
  BEACH_OR_MOUNTAIN: 3,
  MORNINGS: 4,
  FOOD_STYLE: 5,
  PLANNING: 6,
  STAY_STYLE: 7,
  BASES: 8,
  FAMOUS_OR_HIDDEN: 9,
};

/** Answer values. */
export const A = 0;
export const B = 1;
