/**
 * Curated content for the collaborative planner (all mocked).
 * Hand-written for Lisbon, Penang and Valencia; other destinations get
 * generated placeholder items (see `getPlanContent`).
 */
import { CURRENCY_SYMBOL } from './cities.js';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Typical temperature (°C) and price level (1–3) per month. */
const SEASON_DATA = {
  lisbon: {
    temperature: [15, 16, 18, 20, 23, 27, 29, 30, 27, 23, 18, 15],
    priceLevel: [1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 1, 1],
    note: 'Warm, quieter and cheaper',
  },
  penang: {
    temperature: [31, 31, 32, 32, 32, 31, 31, 31, 30, 30, 30, 31],
    priceLevel: [3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3],
    note: 'Dry-ish and good value',
  },
  valencia: {
    temperature: [14, 15, 17, 19, 22, 26, 29, 29, 26, 22, 17, 14],
    priceLevel: [1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 1, 1],
    note: 'Beach-warm without the August crowds',
  },
  tokyo: {
    temperature: [6, 7, 11, 16, 21, 24, 28, 30, 26, 20, 14, 9],
    priceLevel: [1, 1, 3, 3, 2, 1, 2, 2, 2, 3, 2, 1],
    note: 'Cherry blossoms in spring, crisp and quiet in winter',
  },
};

/** Season data for a destination (generated from its "warmth" if not curated). */
export const getSeasonData = (destination) => {
  if (SEASON_DATA[destination.id]) return SEASON_DATA[destination.id];
  const warmth = destination.traits.warm;
  return {
    temperature: MONTHS.map((_, month) =>
      Math.round(8 + warmth * 22 - Math.cos((month / 12) * Math.PI * 2) * 8 * (1 - warmth * 0.4)),
    ),
    priceLevel: [2, 1, 1, 2, 2, 3, 3, 3, 2, 2, 1, 2],
    note: 'Shoulder season sweet spot',
  };
};

/** Airport codes shown on flight rows. */
export const AIRPORT_CODES = {
  lisbon: 'LIS',
  penang: 'PEN',
  valencia: 'VLC',
  sicily: 'CTA',
  bali: 'DPS',
  tokyo: 'HND',
  chiangmai: 'CNX',
  dolomites: 'VCE',
  hokkaido: 'CTS',
};

/** The towns a multi-stop trip moves between: [firstBase, secondBase]. */
export const TRIP_STOPS = {
  lisbon: ['Lisbon', 'Cascais'],
  penang: ['George Town', 'Batu Ferringhi'],
  valencia: ['Valencia', 'Albufera'],
  sicily: ['Palermo', 'Cefalù'],
  bali: ['Ubud', 'Seminyak'],
  tokyo: ['Tokyo', 'Kyoto'],
  chiangmai: ['Chiang Mai', 'Pai'],
  dolomites: ['Ortisei', 'Seiser Alm'],
  hokkaido: ['Sapporo', 'Niseko'],
};

export const PLAN_CONTENT = {
  lisbon: {
    stay: [
      {
        name: 'Casa Azulejo Boutique',
        area: 'Chiado, Lisbon',
        price: '€165',
        rating: 4.8,
        tag: 'Boutique',
        description: 'Tiled townhouse with a rooftop bar. Walk to everything.',
      },
      {
        name: 'Alfama Rooftop House',
        area: 'Alfama, Lisbon',
        price: '€140',
        rating: 4.6,
        tag: 'Views',
        description: 'Terrace over the Tagus; tram 28 at the door.',
      },
      {
        name: 'Cascais Bay Rooms',
        area: 'Cascais',
        price: '€175',
        rating: 4.7,
        tag: 'Near the beach',
        description: 'Five minutes to the sand, train to Lisbon every 20 minutes.',
      },
    ],
    do: [
      {
        name: 'Tram 28 & Alfama wander',
        tag: 'Classic',
        meta: '2h · €3',
        description: 'The famous yellow tram, then get lost on purpose.',
      },
      {
        name: 'Sintra day trip: Pena Palace',
        tag: 'Day trip',
        meta: 'Full day · €14',
        description: 'Fairytale palace, misty hills — Jordan’s mountain fix.',
      },
      {
        name: 'Cascais coast bike ride',
        tag: 'Active',
        meta: '3h · €15',
        description: 'Flat coastal path from Cascais to Guincho beach.',
      },
      {
        name: 'Sunset sail on the Tagus',
        tag: 'Romantic',
        meta: '2h · €35',
        description: 'Drinks, golden light, the 25 de Abril bridge.',
      },
    ],
    eat: [
      {
        name: 'Time Out Market Lisboa',
        tag: 'Food hall',
        meta: 'Cais do Sodré · €€',
        description: 'Forty stalls, one big table — perfect for the street-food group.',
      },
      {
        name: 'Pastéis de Belém',
        tag: 'Bakery',
        meta: 'Belém · €',
        description: 'The original custard tarts. Go early.',
      },
      {
        name: 'Cervejaria Ramiro',
        tag: 'Seafood',
        meta: 'Intendente · €€€',
        description: 'Tiger prawns and a long, loud, brilliant dinner.',
      },
      {
        name: 'Harbour lunch in Cascais',
        tag: 'Long lunch',
        meta: 'Cascais · €€',
        description: 'Grilled fish by the water; Theo’s kind of afternoon.',
      },
    ],
  },
  tokyo: {
    stay: [
      {
        name: 'Shinjuku Neon Hotel',
        area: 'Shinjuku, Tokyo',
        price: '¥24,000',
        rating: 4.7,
        tag: 'Boutique',
        description: 'Design hotel above the lights, minutes from the station.',
      },
      {
        name: 'Asakusa Ryokan House',
        area: 'Asakusa, Tokyo',
        price: '¥19,000',
        rating: 4.6,
        tag: 'Story stay',
        description: 'Tatami rooms, a shared bath and Sensō-ji at the end of the street.',
      },
      {
        name: 'Kyoto Machiya Stay',
        area: 'Gion, Kyoto',
        price: '¥32,000',
        rating: 4.9,
        tag: 'Traditional',
        description: 'A restored wooden townhouse in the old geisha district.',
      },
    ],
    do: [
      {
        name: 'Tokyo Disneyland',
        tag: 'Theme park',
        meta: 'Full day · ¥9,400',
        description: 'Castle, parades and the full-day queue strategy — pre-book entry for the whole group.',
      },
      {
        name: 'teamLab Planets',
        tag: 'Immersive art',
        meta: '2h · ¥3,800',
        description: 'Walk barefoot through water and light installations.',
      },
      {
        name: 'Fushimi Inari at sunrise',
        tag: 'Early start',
        meta: '2h · Free',
        description: 'Thousands of red torii gates, before the crowds arrive.',
      },
      {
        name: 'Shibuya & Harajuku wander',
        tag: 'City',
        meta: '3h · Free',
        description: 'The crossing, the side streets, and the best people-watching in town.',
      },
    ],
    eat: [
      {
        name: 'Tsukiji Outer Market breakfast',
        tag: 'Street food',
        meta: 'Tsukiji · ¥',
        description: 'Tamago skewers, fresh sushi and grilled seafood on the go.',
      },
      {
        name: 'Omoide Yokocho yakitori alley',
        tag: 'Late night',
        meta: 'Shinjuku · ¥¥',
        description: 'Smoky lanes and counter seats for a dozen people squeezing in.',
      },
      {
        name: 'Ichiran ramen',
        tag: 'Ramen',
        meta: 'Shibuya · ¥',
        description: 'Solo booths, custom bowls — a rite of passage.',
      },
      {
        name: 'Kaiseki dinner in Gion',
        tag: 'Splurge',
        meta: 'Kyoto · ¥¥¥¥',
        description: 'A slow, seasonal multi-course dinner for the one big night.',
      },
    ],
  },
  penang: {
    stay: [
      {
        name: 'Heritage Shophouse Hotel',
        area: 'George Town',
        price: 'RM 380',
        rating: 4.7,
        tag: 'Boutique',
        description: 'Restored 1900s shophouse with a courtyard pool.',
      },
      {
        name: 'Batu Ferringhi Beach Rooms',
        area: 'Batu Ferringhi',
        price: 'RM 450',
        rating: 4.5,
        tag: 'Beach',
        description: 'Sea views, night market on the doorstep.',
      },
      {
        name: 'Hillside Villa',
        area: 'Penang Hill',
        price: 'RM 520',
        rating: 4.8,
        tag: 'Story stay',
        description: 'Cool mountain air, jungle breakfast.',
      },
    ],
    do: [
      {
        name: 'George Town street-art walk',
        tag: 'City',
        meta: '2h · Free',
        description: 'Murals, shophouses and hidden lanes.',
      },
      {
        name: 'Kek Lok Si temple',
        tag: 'Culture',
        meta: '2h · RM 10',
        description: 'Layered temple on the hill, spectacular at dusk.',
      },
      {
        name: 'Penang Hill sunrise',
        tag: 'Early start',
        meta: 'Half day · RM 30',
        description: 'Funicular up before the heat; ideal for the 6am train group.',
      },
      {
        name: 'Market tour + cooking class',
        tag: 'Food',
        meta: '4h · RM 220',
        description: 'Shop, chop and eat what you cooked.',
      },
    ],
    eat: [
      {
        name: 'Gurney Drive hawker centre',
        tag: 'Hawker',
        meta: 'Seafront · $',
        description: 'Char kway teow, satay, ice kacang.',
      },
      {
        name: 'Chulia Street noodles',
        tag: 'Street food',
        meta: 'George Town · $',
        description: 'Priya’s humid-night-market dream, delivered.',
      },
      {
        name: 'Cendol on Penang Road',
        tag: 'Dessert',
        meta: 'George Town · $',
        description: 'Queue. Eat. Queue again.',
      },
      {
        name: 'Nasi kandar breakfast',
        tag: 'Local classic',
        meta: 'Beach Street · $',
        description: 'Rice with every curry. Pace yourself.',
      },
    ],
  },
  valencia: {
    stay: [
      {
        name: 'El Carmen Courtyard Hotel',
        area: 'El Carmen',
        price: '€125',
        rating: 4.6,
        tag: 'Boutique',
        description: 'Quiet courtyard in the old town.',
      },
      {
        name: 'Malvarrosa Beach Boutique',
        area: 'Malvarrosa',
        price: '€140',
        rating: 4.5,
        tag: 'Beach',
        description: 'Wake up 100m from the sand.',
      },
      {
        name: 'Ruzafa Design Rooms',
        area: 'Ruzafa',
        price: '€110',
        rating: 4.7,
        tag: 'Hip',
        description: 'Cafés, bars and good vintage shopping.',
      },
    ],
    do: [
      {
        name: 'City of Arts and Sciences',
        tag: 'Modern',
        meta: '3h · €20',
        description: 'Futuristic architecture and a lazy picnic.',
      },
      {
        name: 'Albufera sunset boat',
        tag: 'Nature',
        meta: '1h · €8',
        description: 'Rice fields, flamingos, orange sky.',
      },
      {
        name: 'Turia gardens bike loop',
        tag: 'Easy',
        meta: '2h · €10',
        description: 'Flat, shady, great for different energy levels.',
      },
      {
        name: 'Mercado Central',
        tag: 'Food',
        meta: '1h · Free',
        description: 'Modernist market hall, ham and oranges.',
      },
    ],
    eat: [
      {
        name: 'Paella by Malvarrosa beach',
        tag: 'Classic',
        meta: 'Beachfront · €€',
        description: 'The original, cooked over orange wood.',
      },
      { name: 'Horchata & fartons', tag: 'Snack', meta: 'Alboraya · €', description: 'Sweet, cold, very Valencian.' },
      {
        name: 'Ruzafa tapas crawl',
        tag: 'Late night',
        meta: 'Ruzafa · €€',
        description: 'Seven bars, one long night.',
      },
      {
        name: 'Central Market breakfast',
        tag: 'Breakfast',
        meta: 'Centro · €',
        description: 'Bocadillos at the counter.',
      },
    ],
  },
};

export const PLACE_CATALOG = [
  {
    pattern: /disney/i,
    name: 'Tokyo Disneyland',
    kind: 'do',
    area: '1-1 Maihama, Urayasu, Chiba',
    hours: 'Daily 09:00–21:00 (varies by season)',
    travel: '16 min by JR Keiyo line from Tokyo Station + 5 min on the resort line',
    link: 'tokyodisneyresort.jp',
    description: 'The full castle-and-parades day. Pre-book entry, and consider an Express line pass for the big rides.',
    booking: 'Date-specific tickets required · from ¥9,400 per adult. Express line passes sold separately.',
    tag: 'Theme park',
    meta: 'Full day · ¥9,400',
  },
  {
    pattern: /tsukiji/i,
    name: 'Tsukiji Outer Market',
    kind: 'eat',
    area: '4 Chome Tsukiji, Chuo City, Tokyo',
    hours: 'Daily 05:00–14:00 (stalls vary)',
    travel: '5 min walk from Tsukiji station',
    link: 'tsukiji.or.jp',
    description: 'Tamago skewers, fresh sushi and grilled seafood stall by stall. Go hungry and early.',
    booking: 'No booking needed · carry cash.',
    tag: 'Street food',
    meta: 'Tsukiji · ¥',
  },
  {
    pattern: /fushimi|inari/i,
    name: 'Fushimi Inari Shrine',
    kind: 'do',
    area: '68 Fukakusa Yabunouchicho, Kyoto',
    hours: 'Open 24 hours — sunrise is best',
    travel: '5 min by JR Nara line from Kyoto Station',
    link: 'inari.jp',
    description: 'Thousands of red torii gates winding up the mountain. Beat the crowds at dawn.',
    booking: 'Free entry · no booking needed.',
    tag: 'Early start',
    meta: '2h · Free',
  },
  {
    pattern: /time\s*out|mercado da ribeira/i,
    name: 'Time Out Market Lisboa',
    kind: 'eat',
    area: 'Av. 24 de Julho, Cais do Sodré',
    hours: 'Daily 10:00–00:00 (Fri–Sat until 02:00)',
    travel: '12 min by tram from Chiado · 25 min walk',
    link: 'timeoutmarket.com/lisboa/menu',
    description:
      'A buzzing food hall with 40+ stalls from Lisbon’s best chefs. Easy for groups who can’t agree on dinner.',
    booking: 'No booking needed. Large groups can reserve a table via the website.',
    tag: 'Food hall',
    meta: 'Cais do Sodré · €€',
  },
  {
    pattern: /bel[eé]m|past[eé]is|pasteis/i,
    name: 'Pastéis de Belém',
    kind: 'eat',
    area: 'R. de Belém 84–92, Belém',
    hours: 'Daily 08:00–23:00',
    travel: '20 min by tram 15E from Praça da Figueira',
    link: 'pasteisdebelem.pt/menu',
    description: 'The original custard tart bakery since 1837. Eat them warm with cinnamon.',
    booking: 'Walk-in only. Queue moves fast; sit-down room round the back.',
    tag: 'Bakery',
    meta: 'Belém · €',
  },
  {
    pattern: /pena|sintra/i,
    name: 'Pena Palace, Sintra',
    kind: 'do',
    area: 'Estrada da Pena, Sintra',
    hours: 'Daily 09:30–18:30 (last entry 18:00)',
    travel: '45 min by train + 15 min bus from Lisbon Rossio',
    link: 'parquesdesintra.pt/pena',
    description: 'A colourful hilltop palace in the clouds. Book the first slot to beat the tour buses.',
    booking: 'Timed tickets advised · from €14 per adult.',
    tag: 'Day trip',
    meta: 'Full day · €14',
  },
  {
    pattern: /lx\s*factory|lxfactory/i,
    name: 'LX Factory',
    kind: 'do',
    area: 'R. Rodrigues de Faria 103, Alcântara',
    hours: 'Shops 12:00–20:00 · Bars until late',
    travel: '15 min by tram 15E from Cais do Sodré',
    link: 'lxfactory.com',
    description: 'Creative quarter in an old fabric factory: shops, murals, bookshops, rooftop bars.',
    booking: 'Free entry. Restaurants take reservations.',
    tag: 'Creative',
    meta: 'Alcântara · Free',
  },
  {
    pattern: /gurney|hawker|char\s*kway/i,
    name: 'Gurney Drive Hawker Centre',
    kind: 'eat',
    area: 'Persiaran Gurney, George Town',
    hours: 'Daily 17:00–01:00',
    travel: '15 min by Grab from George Town',
    link: 'tripadvisor.com/gurney-drive',
    description: 'Penang’s famous seafront hawker strip: char kway teow, assam laksa, satay.',
    booking: 'No bookings. Arrive before 19:00 for a seat.',
    tag: 'Hawker',
    meta: 'Seafront · $',
  },
  {
    pattern: /kek\s*lok|temple/i,
    name: 'Kek Lok Si Temple',
    kind: 'do',
    area: 'Air Itam, Penang',
    hours: 'Daily 08:30–17:30',
    travel: '30 min by bus 204 from Komtar',
    link: 'kekloksitemple.com',
    description: 'Southeast Asia’s largest Buddhist temple, tiered up a hillside.',
    booking: 'Free entry; funicular RM 6.',
    tag: 'Culture',
    meta: '2h · RM 10',
  },
  {
    pattern: /mercado central|central market/i,
    name: 'Mercado Central de València',
    kind: 'eat',
    area: 'Plaça de la Ciutat de Bunyol, Valencia',
    hours: 'Mon–Sat 07:30–15:00',
    travel: '10 min walk from Plaza del Ayuntamiento',
    link: 'mercadocentralvalencia.es',
    description: 'A modernist market hall with 900 stalls of ham, oranges and tiny bars.',
    booking: 'No booking. Closed Sundays.',
    tag: 'Market',
    meta: 'Centro · €',
  },
  {
    pattern: /ciutat|arts and sciences|ciencias/i,
    name: 'City of Arts and Sciences',
    kind: 'do',
    area: 'Av. Professor López Piñero, Valencia',
    hours: 'Daily 10:00–21:00',
    travel: '20 min by bus 35 from the centre',
    link: 'cac.es',
    description: 'Spectacular white architecture, an aquarium, and the best photos in town.',
    booking: 'Combined tickets online from €20.',
    tag: 'Modern',
    meta: '3h · €20',
  },
];

/** Suggestions per planner section for a destination: { stay, do, eat }. */
export const getPlanContent = (destination) => {
  if (PLAN_CONTENT[destination.id]) return PLAN_CONTENT[destination.id];
  const city = destination.name.split(' +')[0];
  return {
    stay: [
      {
        name: `${city} Boutique House`,
        area: 'Old town',
        price: destination.costLevel > 2 ? '$$$' : '$$',
        rating: 4.6,
        tag: 'Boutique',
        description: 'Characterful stay near the best bits.',
      },
      {
        name: `${city} Story Stay`,
        area: 'Edge of town',
        price: '$$',
        rating: 4.7,
        tag: 'Story',
        description: 'Somewhere with a tale to tell.',
      },
    ],
    do: [
      {
        name: `${city} highlights day`,
        tag: 'Classic',
        meta: 'Full day',
        description: 'The greatest hits, nicely paced.',
      },
      {
        name: `A secret spot near ${city}`,
        tag: 'Hidden gem',
        meta: 'Half day',
        description: 'Ask a local. roam2gether already did.',
      },
    ],
    eat: [
      { name: `Best local dinner in ${city}`, tag: 'Long table', meta: '€€', description: 'Slow, shared and loud.' },
      { name: `${city} street-food crawl`, tag: 'Street food', meta: '€', description: 'Point, pay, devour.' },
    ],
  };
};

/** "Getting around" suggestions shaped like planner items. */
export const getMoveSuggestions = (destination) =>
  destination.localRoutes.map((route) => ({
    name: route.title,
    tag: route.mode,
    meta: `${route.duration} · ${route.price}`,
    description: '',
    mode: route.mode,
  }));

/**
 * AI "fill in the details": turn whatever the user pasted into a draft place card.
 * Known places come from the catalog; anything else gets a flagged best guess.
 */
export const draftPlaceFromText = (pasted) => {
  const text = pasted.trim();
  const known = PLACE_CATALOG.find((place) => place.pattern.test(text));
  if (known) return { ...known, confidence: 'high', source: text };

  const name = guessNameFromText(text);
  const kind = guessKind(text);
  return {
    name,
    kind,
    area: 'Near your stay · address confirmed on add',
    hours: { eat: 'Typically 12:00–22:00', stay: 'Check-in from 15:00' }[kind] ?? 'Typically 09:00–18:00',
    travel: 'About 15–25 min from your base',
    link: '(link added from what you pasted)',
    description: 'roam2gether’s best guess from the link. Check details before you book.',
    booking: kind === 'eat' ? 'Reservations recommended for groups.' : 'Tickets may sell out in peak season.',
    tag: { eat: 'Food', stay: 'Stay' }[kind] ?? 'Activity',
    meta: kind === 'eat' ? '€€' : 'Open daily',
    confidence: 'low',
    source: text,
  };
};

const guessKind = (text) => {
  if (/hotel|stay|inn|hostel|riad|resort|villa/i.test(text)) return 'stay';
  if (/restaurant|cafe|café|bar|bistro|market|kitchen|grill|noodle|bakery|pizza|dinner|lunch|brunch/i.test(text))
    return 'eat';
  return 'do';
};

/** "https://site.com/some-noodle-bar" → "Some Noodle Bar". */
const guessNameFromText = (text) => {
  let name = text;
  try {
    const url = new URL(/^https?:/.test(text) ? text : `https://${text}`);
    if (url.hostname.includes('.') && !/\s/.test(text)) {
      const slug = url.pathname.split('/').filter(Boolean).pop() || url.hostname.replace(/^www\./, '').split('.')[0];
      name = decodeURIComponent(slug)
        .replace(/[-_]+/g, ' ')
        .replace(/\.\w+$/, '');
    }
  } catch {
    /* not a URL — use the text as-is */
  }
  return name.replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 48) || 'New place';
};

export const currencyFor = (region) => CURRENCY_SYMBOL[region] ?? 'US$';
