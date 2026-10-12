/**
 * Follow-up questions shown after the quiz. Only one "path" is shown per
 * participant: one set for the timing and one for the group type, then the
 * secret-hope question for everyone.
 *
 * type 'choice' → big tappable tiles ( [label, emoji] pairs )
 * type 'text'   → optional free text with example chips
 */

export const FOLLOW_UP_QUESTIONS = {
  byTiming: {
    locked: [
      {
        id: 'travel',
        type: 'choice',
        eyebrow: 'About the dates',
        question: 'How much travel time are you willing to spend getting there?',
        options: [
          ['Keep it close', '🚆'],
          ['A medium-haul adventure is fine', '✈️'],
          ['Take me anywhere', '🌏'],
        ],
      },
      {
        id: 'leave',
        type: 'text',
        eyebrow: 'About the dates',
        question: 'What would make this trip worth the annual-leave sacrifice?',
        placeholder: 'e.g. “Sleeping past 8am without guilt”',
        chips: ['Properly switching off', 'One unreal meal', 'A story for the group chat'],
      },
    ],
    rough: [
      {
        id: 'matters',
        type: 'choice',
        eyebrow: 'About the window',
        question: 'What matters more?',
        options: [
          ['The right weather', '☀️'],
          ['The best deal', '🏷️'],
          ['The right people being free', '🗓️'],
        ],
      },
      {
        id: 'flex',
        type: 'choice',
        eyebrow: 'About the window',
        question: 'How flexible are you on dates?',
        options: [
          ['A few days either side', '↔️'],
          ['Any week that month', '📅'],
          ['Surprise me', '🎲'],
        ],
      },
    ],
    dreaming: [
      {
        id: 'book',
        type: 'choice',
        eyebrow: 'Still dreaming',
        question: 'What would actually get you to press book?',
        options: [
          ['A ridiculous deal', '🏷️'],
          ['A big occasion', '🎉'],
          ['A destination I can’t stop thinking about', '💭'],
          ['Someone else doing the planning', '🙌'],
        ],
      },
      {
        id: 'mood',
        type: 'choice',
        eyebrow: 'Still dreaming',
        question: 'Pick your travel mood right now',
        options: [
          ['Need a break', '🛋️'],
          ['Need an adventure', '🧭'],
          ['Need to celebrate', '🥂'],
          ['Need sunshine immediately', '🌞'],
        ],
      },
    ],
  },
  byGroup: {
    couple: [
      {
        id: 'day',
        type: 'choice',
        eyebrow: 'About the two of you',
        question: 'Your ideal shared day is…',
        options: [
          ['Food, wandering and one nice drink', '🍷'],
          ['Nature, views and being slightly offline', '🏞️'],
          ['Museums, markets and a full plan', '🗺️'],
          ['Hotel pool and no questions asked', '🏊'],
        ],
      },
      {
        id: 'romance',
        type: 'text',
        eyebrow: 'About the two of you',
        question: 'Romantic, ridiculous, or both?',
        placeholder: 'e.g. “Both, with a sunset in the middle”',
        chips: ['Romantic', 'Ridiculous', 'Both, please'],
      },
    ],
    friends: [
      {
        id: 'why',
        type: 'choice',
        eyebrow: 'About the group',
        question: 'What is the group really travelling for?',
        options: [
          ['A birthday / celebration', '🎂'],
          ['Eating and drinking well', '🍝'],
          ['Adventure and stories', '⛰️'],
          ['Escaping normal life', '🏝️'],
        ],
      },
      {
        id: 'together',
        type: 'choice',
        eyebrow: 'About the group',
        question: 'How much group time is the correct amount?',
        options: [
          ['All together', '👯'],
          ['Mostly together, some freedom', '🌗'],
          ['Meet for dinner and let me roam', '🧭'],
        ],
      },
    ],
    family: [
      {
        id: 'enjoy',
        type: 'choice',
        eyebrow: 'About the family',
        question: 'What keeps the trip enjoyable for everyone?',
        options: [
          ['Easy logistics', '🧳'],
          ['Pools / beach', '🏖️'],
          ['Big activities', '🎢'],
          ['Room to run around', '🌳'],
        ],
      },
      {
        id: 'needs',
        type: 'text',
        eyebrow: 'About the family',
        question: 'Any must-consider needs?',
        placeholder: 'e.g. “Nap-friendly afternoons”, “a kitchen”',
        chips: ['Nap-friendly', 'Pram-friendly', 'Picky eaters'],
      },
    ],
    bigfamily: [
      {
        id: 'matter',
        type: 'choice',
        eyebrow: 'About the family',
        question: 'What matters most?',
        options: [
          ['Easy getting around', '♿'],
          ['Comfortable accommodation', '🛏️'],
          ['Something for every age', '🎈'],
          ['One unforgettable shared activity', '✨'],
        ],
      },
      {
        id: 'design',
        type: 'text',
        eyebrow: 'About the family',
        question: 'Anything we should design around?',
        placeholder: 'e.g. “Gran can’t do stairs”',
        chips: ['Step-free', 'Early dinners', 'Lots of seating'],
      },
    ],
  },
  hope: {
    id: 'hope',
    type: 'text',
    eyebrow: 'The secret bit',
    question: 'One destination, experience or feeling you secretly hope this trip has?',
    placeholder: 'I want to eat noodles in a humid night market',
    chips: [
      'Somewhere Mum can get around easily',
      'A beach where nobody asks me to open Slack',
      'Noodles in a humid night market',
    ],
  },
};

/** Which group path each trip type uses. */
export const GROUP_PATH_FOR_TYPE = {
  two: 'couple',
  friends: 'friends',
  work: 'friends',
  family: 'family',
  bigfamily: 'bigfamily',
};

/**
 * Words in someone's "secret hope" that nudge a destination trait.
 * [pattern, trait, strength]
 */
export const HOPE_KEYWORDS = [
  [/noodle|night market|street|hawker|market/i, 'street', 0.03],
  [/beach|swim|sea|island/i, 'beach', 0.03],
  [/snow|ski|powder/i, 'snow', 0.03],
  [/mountain|hike|trek|hill/i, 'mountain', 0.03],
  [/wine|vineyard|long lunch|dinner/i, 'table', 0.02],
  [/slack|offline|quiet|slow|relax|nap/i, 'slow', 0.02],
  [/mum|mom|dad|gran|easy|accessible|step/i, 'flex', 0.02],
  [/city|bar|club|night/i, 'late', 0.02],
];
