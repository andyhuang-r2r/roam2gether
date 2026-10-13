import { QUIZ_SCENE_PAIRS } from '../scenes/quizScenes.js';

/**
 * Alternative wordings for the ten dilemmas, used by the "AI-written" quiz.
 * Slot i always asks the same question as QUIZ_QUESTIONS[i] (A and B keep their
 * meaning, so scoring still works) — only the framing changes. Scenes are reused.
 */
export const QUIZ_VARIANTS = [
  [
    { hint: 'Think of the cousins’ group chat photo.', a: ['Sunscreen and sunsets', 'Flip-flops all week'], b: ['Fireside and fresh powder', 'Big jumpers, bigger hot chocolates'] },
    { hint: 'First thing you’d pack?', a: ['Swimmers', 'Anywhere that’s warm by 9am'], b: ['A proper coat', 'Cold cheeks, warm cabins'] },
    { hint: 'Pick your weather.', a: ['Hot enough to skip the jacket', 'Shorts in every photo'], b: ['Crisp, white and quiet', 'Breath you can see'] },
  ],
  [
    { hint: 'Which airport board are you reading?', a: ['Europe', 'Cobblestones and aperitivo'], b: ['Asia', 'Temples, ramen and bright lights'] },
    { hint: 'Where does the family story start?', a: ['Somewhere in Europe', 'Piazzas and long lunches'], b: ['Somewhere in Asia', 'Street snacks at midnight'] },
    { hint: 'Choose a flight path.', a: ['West to the old world', 'Cafés older than your country'], b: ['East to the big flavours', 'Markets you’ll still dream about'] },
  ],
  [
    { hint: 'Where do you recharge?', a: ['In the thick of a city', 'Trams, rooftops and people-watching'], b: ['Far from everything', 'Trees, trails and zero notifications'] },
    { hint: 'The ideal view from your window.', a: ['Skyline and streetlights', 'Something is always happening'], b: ['Ridge line and stars', 'The loudest thing is a river'] },
    { hint: 'Pick a soundtrack.', a: ['Traffic, buskers and chatter', 'Alive at every hour'], b: ['Wind, birds and boots on gravel', 'Quiet you can actually hear'] },
  ],
  [
    { hint: 'Everyone gets one day to themselves.', a: ['Spend it by the water', 'Waves, snacks, repeat'], b: ['Spend it up a hill', 'Climb now, brag later'] },
    { hint: 'Where’s the group photo?', a: ['On the sand', 'Everyone squinting happily'], b: ['At the summit', 'Everyone out of breath'] },
    { hint: 'Your ideal rest day looks like…', a: ['Sea and a sunhat', 'Nothing on the to-do list'], b: ['A ridge walk', 'Earn the lunch'] },
  ],
  [
    { hint: 'What time does the group chat wake up?', a: ['Not before ten', 'Brunch is the main event'], b: ['Whenever the night ends', 'The best stories start after 11'] },
    { hint: 'Be honest about your rhythm.', a: ['Early to bed, slow to rise', 'Pastry and a long think'], b: ['Night owl energy', 'Dinner at ten sounds normal'] },
    { hint: 'Which hour is yours?', a: ['The lazy morning hour', 'Coffee first, plans never'], b: ['The after-midnight hour', 'Music, laughter, one more round'] },
  ],
  [
    { hint: 'The cousins are hungry. Now what?', a: ['Follow the smell', 'Cheap, hot, unforgettable'], b: ['Book the big table', 'Sharing plates and long toasts'] },
    { hint: 'Pick the meal everyone will talk about.', a: ['Standing at a stall', 'Napkins optional'], b: ['A feast with the whole family', 'Never rush dessert'] },
    { hint: 'How do you eat on holiday?', a: ['Grazing the whole city', 'Twelve small bites a day'], b: ['One proper sit-down', 'Linen napkins, long chats'] },
  ],
  [
    { hint: 'Itinerary energy?', a: ['A tight schedule', 'Colour-coded, if we’re honest'], b: ['Go with the flow', 'Decide over breakfast'] },
    { hint: 'Who’s holding the plan?', a: ['Me, with a spreadsheet', 'Every slot is booked'], b: ['Nobody, on purpose', 'We’ll find something'] },
    { hint: 'A free afternoon is…', a: ['A gap to fill', 'There’s always one more sight'], b: ['A gift', 'Wander until something looks good'] },
  ],
  [
    { hint: 'Where does the whole group crash?', a: ['Stylish hotel', 'Breakfast buffet, big beds'], b: ['A place with character', 'Old beams, odd stairs, great stories'] },
    { hint: 'Pick the roof over your heads.', a: ['Polished and easy', 'Front desk who knows your name'], b: ['Quirky and unforgettable', 'A guesthouse nobody else has found'] },
    { hint: 'Home base style?', a: ['Chic city hotel', 'Lobby bar, great shower'], b: ['A villa, cabin or riad', 'Shared courtyard, shared chaos'] },
  ],
  [
    { hint: 'How many suitcases will you unpack?', a: ['Only one, once', 'Settle in and stay put'], b: ['A few stops', 'New town every couple of days'] },
    { hint: 'Moving or staying?', a: ['Stay in one spot', 'Know the barista by day three'], b: ['Keep moving', 'Trains, ferries and detours'] },
    { hint: 'Trip shape?', a: ['A single base', 'Day trips if we feel like it'], b: ['A chain of places', 'The journey is half the fun'] },
  ],
  [
    { hint: 'What would the cousins brag about?', a: ['The big famous sights', 'Because they’re iconic'], b: ['The spot only locals know', 'No queue, all the charm'] },
    { hint: 'First stop on the list?', a: ['The landmark in every guidebook', 'Tick, photo, next'], b: ['The side street no-one mentioned', 'Found it by accident'] },
    { hint: 'Final call: how adventurous?', a: ['Play the greatest hits', 'They’re classics for a reason'], b: ['Go off the map', '“Wait, how did you find this?”'] },
  ],
];

/**
 * Questions written around the new illustrations (see scenes/quizScenes.js).
 * Two phrasings per picture pair; each carries its own scene keys.
 */
const NEW_QUESTIONS = [
  [
    { hint: 'Which postcard is yours?', a: ['Hammock between the palms', 'Sunset and nowhere to be'], b: ['Cabin in the snow', 'Fire on, stars out'] },
    { hint: 'Where would the cousins nap?', a: ['A hammock at golden hour', 'Warm sand, warmer drinks'], b: ['A blanket by the stove', 'Snowflakes at the window'] },
    { hint: 'Pick the mood.', a: ['Barefoot and breezy', 'Hot sand, long shadows'], b: ['Wrapped up and cosy', 'Snow on the roof'] },
  ],
  [
    { hint: 'Pick a street to get lost in.', a: ['A tram through the old town', 'Pastel walls, golden light'], b: ['A lantern-lit temple alley', 'Glowing after dark'] },
    { hint: 'Which one feels like the trip?', a: ['Rattling past old arches', 'Espresso at every corner'], b: ['Paper lanterns overhead', 'Steam, incense, neon'] },
    { hint: 'Choose your streets.', a: ['Trams and terracotta', 'Old-world charm'], b: ['Lanterns and side-streets', 'Glow, spice and steam'] },
  ],
  [
    { hint: 'What’s outside the window?', a: ['Skyline after dark', 'Lights on in every window'], b: ['A tent under the stars', 'Campfire, lake, silence'] },
    { hint: 'Where do the cousins end up at 10pm?', a: ['Up a tower, looking out', 'The city never really stops'], b: ['Around a fire by the water', 'Stars instead of streetlights'] },
    { hint: 'Where do you feel at home?', a: ['High above the city', 'Neon, noise and energy'], b: ['Out by the tent', 'Fire, stars and quiet'] },
  ],
  [
    { hint: 'Free day. Where is everyone?', a: ['Snorkels and sailboats', 'Clear water, bright fish'], b: ['On the trail to the top', 'A flag waiting at the summit'] },
    { hint: 'Choose the adventure.', a: ['Out on the turquoise bay', 'Salt in your hair'], b: ['Up the ridge path', 'Burning legs, big views'] },
    { hint: 'Pick your day out.', a: ['Out on the water', 'Fins, sails and salt'], b: ['Up in the hills', 'Boots, views and bragging rights'] },
  ],
  [
    { hint: 'Your perfect hour?', a: ['Croissant by the window', 'Morning light, no alarm'], b: ['Neon after midnight', 'Disco ball, one more song'] },
    { hint: 'When does the fun start?', a: ['Slow, sunlit breakfast', 'Take the whole morning'], b: ['Long after the sun goes down', 'The dance floor wins'] },
    { hint: 'Which hour is yours?', a: ['The sunlit breakfast hour', 'Pastry first, plans later'], b: ['The after-midnight hour', 'Lights low, music loud'] },
  ],
  [
    { hint: 'Dinner plan?', a: ['Night-market cart', 'Smoky skewers, strings of lights'], b: ['A candlelit feast', 'Wine, laughter, seconds'] },
    { hint: 'The meal the group remembers is…', a: ['Eaten standing, from a paper tray', 'Hot, cheap, perfect'], b: ['Passed around a long table', 'Three courses and a toast'] },
    { hint: 'What’s for dinner?', a: ['Whatever’s sizzling at the cart', 'Hot, fast and glorious'], b: ['The long candlelit table', 'Everyone stays for dessert'] },
  ],
  [
    { hint: 'The plan, as a picture.', a: ['Every hour scheduled', 'Colour-coded and ticked off'], b: ['A paper plane, no plan', 'Drift now, decide later'] },
    { hint: 'How do you travel?', a: ['With a checklist', 'Nothing left to chance'], b: ['With the wind', 'Wherever the day lands'] },
    { hint: 'How do you like your days?', a: ['Planned to the minute', 'Every box ticked'], b: ['Drifting on a breeze', 'See where it lands'] },
  ],
  [
    { hint: 'Check in where?', a: ['A boutique with a great door', 'Brass, plants and a doorman'], b: ['A courtyard of lanterns', 'Tiles, arches and mint tea'] },
    { hint: 'Home base for the group?', a: ['Polished and perfectly kept', 'Fresh towels and a lobby bar'], b: ['Warm, old and full of stories', 'Wake up to a fountain'] },
    { hint: 'Your base for the week?', a: ['A smart little hotel', 'Great door, better lobby'], b: ['A lantern-lit courtyard', 'Warm tiles and mint tea'] },
  ],
  [
    { hint: 'How do you pack?', a: ['One suitcase, one spot', 'Unpack once and breathe'], b: ['Window seat, new view each hour', 'A place a day, trains between'] },
    { hint: 'Trip rhythm?', a: ['Stay put by the sea', 'The same sunset, nightly'], b: ['Keep the train moving', 'See three towns in a week'] },
    { hint: 'Packing style?', a: ['One bag, one beach', 'Stay and soak it up'], b: ['Train ticket in hand', 'New view every hour'] },
  ],
  [
    { hint: 'Which photo are you taking?', a: ['The famous landmark', 'Everyone’s postcard shot'], b: ['The little door down the alley', 'Only locals know it'] },
    { hint: 'The cousins’ best story is…', a: ['Standing under the icon', 'It lived up to the hype'], b: ['The hidden doorway', '“How did you find this?”'] },
    { hint: 'Your best photo?', a: ['The icon everyone knows', 'Crowds and all'], b: ['The door nobody noticed', 'Down the alley, up the stairs'] },
  ],
].map((slot, i) =>
  slot.map((q) => ({ ...q, scenes: QUIZ_SCENE_PAIRS[i] })),
);

/** Per slot: the picture-led questions (every one uses the new illustrations). */
const OPTIONS = NEW_QUESTIONS;

export const QUIZ_PROMPTS = [
  'Cousins edition: this or that?',
  'Your call. This or that?',
  'No wrong answers — this or that?',
  'Quick one: this or that?',
  'Trust your gut. This or that?',
];

const pick = (list, avoid) => {
  const choices = list.map((_, i) => i).filter((i) => i !== avoid);
  return choices[Math.floor(Math.random() * choices.length)];
};

/**
 * Write a fresh survey: for each of the ten slots choose one of the alternative
 * wordings (never the same one twice in a row) and a new opening prompt.
 * @param {object[]} baseQuestions the default ten (for the scene keys)
 * @param {{picks:number[]}|null} previous the survey it replaces, if any
 */
export const generateQuiz = (baseQuestions, previous = null) => {
  const picks = OPTIONS.map((variants, slot) => pick(variants, previous?.picks?.[slot]));
  const prompt = QUIZ_PROMPTS[pick(QUIZ_PROMPTS, QUIZ_PROMPTS.indexOf(previous?.prompt))];
  const questions = picks.map((variant, slot) => {
    const { hint, a, b, scenes } = OPTIONS[slot][variant];
    const base = baseQuestions[slot];
    return {
      hint,
      optionA: { label: a[0], sub: a[1], scene: scenes?.[0] ?? base.optionA.scene },
      optionB: { label: b[0], sub: b[1], scene: scenes?.[1] ?? base.optionB.scene },
    };
  });
  return { picks, prompt, questions };
};
