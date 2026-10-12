/**
 * Illustrated "photo" placeholders for quiz cards and destination cards.
 *
 * Every scene is a function that returns an SVG string (viewBox 400×500,
 * cropped to fit its card). They are drawn in code so nothing can fail to
 * load. To use real photography later, render an <img> in `renderScene`
 * instead (see scenes/index.js).
 *
 * Helpers below build gradients, palms, pines, houses, stars and bulbs.
 * Scenes accept an optional `variant` (e.g. 'lisbon', 'bali') for tweaks.
 */
import { createRng } from '../lib/utils.js';
import { transportPaths } from '../lib/icons.js';

const GR = (id, stops, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"/>`).join('')}</linearGradient>`;
const SV = (defs, body) =>
  `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs}</defs>${body}</svg>`;
const BG = (id) => `<rect width="400" height="500" fill="url(#${id})"/>`;
function palm(x, y, c = '#2A1B2E', s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 230 C8 150 20 80 40 0" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round"/><g transform="translate(40 0)" fill="${c}"><path d="M0 0C-50-30-75-20-95 12 -55-8-25-10 0 0Z"/><path d="M0 0C-40-50-20-75 10-80 -5-45-5-20 0 0Z"/><path d="M0 0C40-50 70-45 90-15 55-25 25-20 0 0Z"/><path d="M0 0C50-5 80 20 85 50 55 25 25 15 0 0Z"/><path d="M0 0C-45 0-70 25-70 55-45 30-20 15 0 0Z"/></g></g>`;
}
function pine(x, y, s, c) {
  return `<path d="M${x} ${y - 60 * s}L${x - 22 * s} ${y - 18 * s}H${x - 10 * s}L${x - 30 * s} ${y + 18 * s}H${x + 30 * s}L${x + 10 * s} ${y - 18 * s}H${x + 22 * s}Z" fill="${c}"/>`;
}
function houses(seed, y0, cols, n, ww) {
  const r = createRng(seed);
  let o = '';
  let x = -10;
  for (let i = 0; i < n; i++) {
    const w = ww * (0.7 + r() * 0.7),
      h = 60 + r() * 110,
      c = cols[Math.floor(r() * cols.length)];
    o += `<rect x="${x}" y="${y0 - h}" width="${w}" height="${h + 300}" fill="${c}"/>`;
    const wc = Math.floor(w / 22);
    for (let k = 0; k < wc; k++)
      for (let j = 0; j < Math.floor(h / 32); j++)
        if (r() > 0.35)
          o += `<rect x="${x + 8 + k * 22}" y="${y0 - h + 12 + j * 32}" width="9" height="15" rx="2" fill="#5b2a1c" opacity=".55"/>`;
    if (r() > 0.6) o += `<path d="M${x} ${y0 - h}l${w / 2} -16 ${w / 2} 16z" fill="#a8452d"/>`;
    x += w + 2;
  }
  return o;
}
function stars(seed, n, y1) {
  const r = createRng(seed);
  let o = '';
  for (let i = 0; i < n; i++)
    o += `<circle cx="${r() * 400}" cy="${r() * y1}" r="${0.6 + r() * 1.5}" fill="#fff" opacity="${0.4 + r() * 0.6}"/>`;
  return o;
}
function bulbs(y, amp, n, c = '#FFE08A') {
  let o = `<path d="M-10 ${y} Q200 ${y + amp} 410 ${y}" stroke="#2a2220" stroke-width="2" fill="none"/>`;
  for (let i = 0; i <= n; i++) {
    const t = i / n,
      x = -10 + 420 * t,
      yy = y + 2 * amp * t * (1 - t);
    o += `<circle cx="${x}" cy="${yy + 6}" r="6" fill="${c}"/><circle cx="${x}" cy="${yy + 6}" r="14" fill="${c}" opacity=".25"/>`;
  }
  return o;
}

export const SCENES = {
  sun: (v) =>
    SV(
      GR('a1', [
        [0, v == 'bali' ? '#FFD36B' : '#FFC857'],
        [0.5, '#FF8A5B'],
        [1, '#E8466C'],
      ]) +
        GR('a2', [
          [0, '#2BB5C9'],
          [1, '#0A5D84'],
        ]),
      BG('a1') +
        `<circle cx="270" cy="200" r="130" fill="#FFE08A" opacity=".3"/><circle cx="270" cy="200" r="72" fill="#FFF1B8"/><rect y="310" width="400" height="190" fill="url(#a2)"/><path d="M200 330h140M215 348h110M235 366h70M250 384h40" stroke="#FFF1B8" stroke-width="5" stroke-linecap="round" opacity=".85"/>` +
        palm(30, 265, '#2A1B2E', 1) +
        (v == 'bali' ? palm(300, 330, '#3a1a30', 0.7) : ''),
    ),
  snow: (v) =>
    SV(
      GR('b1', [
        [0, '#BFD9F5'],
        [1, '#F4FAFF'],
      ]),
      BG('b1') +
        `<circle cx="320" cy="90" r="34" fill="#fff" opacity=".8"/><path d="M-10 330L110 130 190 260 250 170 420 360V500H-10Z" fill="#7FA6D3"/><path d="M110 130l-38 62 24-10 14 18 14-18 22 10zM250 170l-34 56 22-8 12 14 14-14 20 8z" fill="#fff"/><path d="M-10 410Q120 340 250 410T420 390V500H-10Z" fill="#fff"/>` +
        pine(60, 400, 1.1, '#2c5f57') +
        pine(100, 420, 0.8, '#336e63') +
        pine(350, 410, 1, '#2c5f57') +
        `<g fill="#cfe0f3"><ellipse cx="170" cy="450" rx="9" ry="5"/><ellipse cx="195" cy="468" rx="9" ry="5"/><ellipse cx="170" cy="486" rx="9" ry="5"/><ellipse cx="222" cy="476" rx="9" ry="5"/></g>` +
        stars(5, 40, 380).replace(/#fff/g, '#fff'),
    ),
  europe: (v) => {
    const k = {
      lisbon: ['#FFD7A8', '#F7A58B', '#C96A8A'],
      sicily: ['#FFE6B0', '#F5B96B', '#D9774B'],
      def: ['#FFD7A8', '#F7A58B', '#C96A8A'],
    }[v] || ['#FFD7A8', '#F7A58B', '#C96A8A'];
    const cols =
      v == 'sicily' ? ['#E3B26B', '#D99A55', '#F3D9A8', '#C9824A'] : ['#D9693F', '#E8955A', '#F3D9B1', '#C65A4A'];
    return SV(
      GR('c1', [
        [0, k[0]],
        [0.55, k[1]],
        [1, k[2]],
      ]),
      BG('c1') +
        `<circle cx="300" cy="170" r="60" fill="#FFF3C9" opacity=".9"/>` +
        houses(v == 'sicily' ? 7 : 3, 400, cols, 12, 44) +
        `<rect x="160" y="190" width="40" height="230" fill="#F3E2C6"/><path d="M160 190l20 -34 20 34z" fill="#b24a31"/><circle cx="180" cy="232" r="10" fill="#fff" opacity=".8"/><path d="M270 320a38 38 0 0 1 76 0z" fill="#3e8e94"/><rect x="270" y="320" width="76" height="90" fill="#F3E2C6"/>` +
        (v == 'lisbon' || v == 'sicily'
          ? `<rect y="420" width="400" height="80" fill="#2a8fbd"/><path d="M0 440h400M0 462h400" stroke="#9fe0f0" stroke-width="3" opacity=".5"/>`
          : ''),
    );
  },
  asia: (v) =>
    SV(
      GR('d1', [
        [0, '#2B0B3F'],
        [0.55, '#8E1B5B'],
        [1, '#F2784B'],
      ]),
      BG('d1') +
        stars(9, 30, 200) +
        `<circle cx="310" cy="110" r="38" fill="#FFE9B0"/><path d="M-10 400L80 300 160 380 250 290 420 400V500H-10Z" fill="#2a0f33"/><g fill="#190a22"><rect x="170" y="250" width="60" height="150"/><path d="M130 250h140l-22-30h-96zM145 220h110l-18-26h-74zM160 194h80l-14-22h-52zM198 150h4v24h-4z"/></g><g>${[40, 110, 300, 360].map((x, i) => `<line x1="${x}" y1="0" x2="${x}" y2="${60 + (i % 2) * 30}" stroke="#2a0f33" stroke-width="2"/><ellipse cx="${x}" cy="${86 + (i % 2) * 30}" rx="17" ry="22" fill="#E8363A"/><ellipse cx="${x}" cy="${86 + (i % 2) * 30}" rx="26" ry="32" fill="#E8363A" opacity=".25"/>`).join('')}</g><g fill="#FFD36B" opacity=".9">${[...Array(14)].map((_, i) => `<circle cx="${20 + i * 28}" cy="${430 + (i % 3) * 14}" r="4"/>`).join('')}</g>`,
    ),
  city: (v) =>
    SV(
      GR('e1', [
        [0, '#1B1B4B'],
        [0.55, '#7C3A8F'],
        [1, '#FF8A6B'],
      ]),
      BG('e1') +
        stars(2, 25, 160) +
        (() => {
          const r = createRng(11);
          let o = '',
            x = -8;
          while (x < 400) {
            const w = 34 + r() * 40,
              h = 120 + r() * 220;
            o += `<rect x="${x}" y="${460 - h}" width="${w}" height="${h + 60}" fill="#150f2c"/>`;
            for (let j = 0; j < h / 18; j++)
              for (let k = 0; k < w / 14; k++)
                if (r() > 0.55)
                  o += `<rect x="${x + 5 + k * 14}" y="${460 - h + 8 + j * 18}" width="6" height="9" fill="#FFD36B" opacity="${0.5 + r() * 0.5}"/>`;
            x += w + 3;
          }
          return o;
        })() +
        `<g stroke-linecap="round" opacity=".85"><path d="M-10 470L420 440" stroke="#FF5EA8" stroke-width="5"/><path d="M-10 485L420 462" stroke="#FFC857" stroke-width="4"/><path d="M-10 498L420 482" stroke="#6AE0FF" stroke-width="3"/></g>`,
    ),
  wild: (v) =>
    SV(
      GR('f1', [
        [0, v == 'chiangmai' ? '#FFE8B8' : '#E7F5D8'],
        [1, '#BFE3B0'],
      ]),
      BG('f1') +
        `<ellipse cx="300" cy="120" rx="90" ry="26" fill="#fff" opacity=".6"/><path d="M-10 300Q100 200 200 290T420 260V500H-10Z" fill="#7DBA7A"/><path d="M-10 350Q120 280 250 350T420 330V500H-10Z" fill="#4C9A64"/><path d="M-10 420Q150 380 260 430T420 410V500H-10Z" fill="#256B52"/><path d="M180 500C190 450 150 430 200 395S220 350 260 330" stroke="#8fd8ea" stroke-width="16" fill="none" stroke-linecap="round" opacity=".9"/><ellipse cx="200" cy="330" rx="150" ry="22" fill="#fff" opacity=".35"/>` +
        pine(60, 440, 1.3, '#143f33') +
        pine(340, 450, 1.5, '#143f33') +
        pine(300, 470, 1, '#1b4d3d') +
        (v == 'chiangmai'
          ? `<g transform="translate(250 262)"><path d="M0 40V14l22-16 22 16v26z" fill="#E9B44C"/><path d="M-6 16l28-22 28 22z" fill="#C2473B"/></g>`
          : `<path d="M90 400l24-40 24 40z" fill="#FF8A3D"/>`),
    ),
  beach: (v) =>
    SV(
      GR('g1', [
        [0, '#BDEBFF'],
        [1, '#EAFBFF'],
      ]) +
        GR('g2', [
          [0, '#25C6C9'],
          [1, '#0E8DA8'],
        ]),
      BG('g1') +
        `<circle cx="90" cy="90" r="36" fill="#FFF1B8"/><rect y="230" width="400" height="140" fill="url(#g2)"/><path d="M0 250h400M0 280h400M0 312h400" stroke="#fff" stroke-width="2" opacity=".25"/><path d="M-10 360Q100 330 200 362T420 350V500H-10Z" fill="#F6DFB0"/><path d="M-10 356Q100 326 200 358T420 346" stroke="#fff" stroke-width="8" fill="none" opacity=".9"/><g transform="translate(250 330) rotate(12)"><line x1="0" y1="0" x2="0" y2="120" stroke="#6b4a3a" stroke-width="5"/><path d="M-80 0a80 70 0 0 1 160 0z" fill="#fff"/><path d="M-80 0a80 70 0 0 1 40 -60L0 0zM0 0L40 -60a80 70 0 0 1 40 60z" fill="#DE007B"/></g><rect x="90" y="420" width="90" height="34" rx="6" fill="#2EBAD3" transform="rotate(-8 135 437)"/>` +
        (v == 'valencia' ? `<path d="M290 230q40 -90 90 0z" fill="#fff" opacity=".85"/>` : ''),
    ),
  mountain: (v) => {
    const dol = v == 'dolomites';
    return SV(
      GR('h1', [
        [0, dol ? '#FFB48A' : '#FFD9C2'],
        [1, dol ? '#F7DFC9' : '#E3E2FF'],
      ]),
      BG('h1') +
        `<path d="M-10 330L80 150 140 250 200 110 280 250 340 170 420 330V500H-10Z" fill="${dol ? '#C98C7A' : '#8F9BC9'}"/><path d="M200 110l-40 80 26-10 14 22 16-22 28 10z" fill="#fff" opacity=".85"/><path d="M-10 380L90 270 190 370 300 260 420 380V500H-10Z" fill="${dol ? '#9C5E57' : '#6C76AE'}"/><rect y="400" width="400" height="100" fill="${dol ? '#6aa56a' : '#4F88B8'}"/>` +
        (dol ? '' : `<path d="M0 430h400M0 455h400" stroke="#fff" stroke-width="2" opacity=".25"/>`) +
        pine(50, 420, 1.2, '#1a3f35') +
        pine(350, 430, 1.4, '#1a3f35') +
        pine(310, 440, 0.9, '#245246'),
    );
  },
  slow: () =>
    SV(
      GR('i1', [
        [0, '#FFEBD6'],
        [1, '#FFC7A5'],
      ]),
      BG('i1') +
        `<g><path d="M70 350V180a130 130 0 0 1 260 0V350z" fill="#FFF6D6"/><path d="M82 350V180a118 118 0 0 1 236 0V350z" fill="#FFD27A"/><circle cx="200" cy="210" r="60" fill="#FFF3B8"/><path d="M200 50V350M70 200H330" stroke="#fff" stroke-width="8"/><g stroke="#FFF3B8" stroke-width="5" stroke-linecap="round" opacity=".7"><path d="M200 120V80M130 150l-22-26M270 150l22-26"/></g></g><rect y="350" width="400" height="150" fill="#D98A5E"/><g transform="translate(150 330)"><path d="M0 20h100v40a38 38 0 0 1 -38 38h-24a38 38 0 0 1 -38 -38z" fill="#fff"/><path d="M100 30a24 24 0 0 1 0 44" stroke="#fff" stroke-width="10" fill="none"/><ellipse cx="50" cy="24" rx="46" ry="8" fill="#7a4a2a"/><path d="M35 0q-12 -22 0 -34M62 0q-12 -22 0 -34" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/></g>`,
    ),
  late: () =>
    SV(
      GR('j1', [
        [0, '#0B0A2B'],
        [0.6, '#33104F'],
        [1, '#7A1F78'],
      ]),
      BG('j1') +
        stars(4, 40, 260) +
        `<path d="M310 40a50 50 0 1 0 40 80a40 40 0 1 1 -40 -80z" fill="#FFF1B8"/>` +
        bulbs(70, 60, 9, '#FFC857') +
        `<circle cx="110" cy="250" r="62" fill="none" stroke="#FF3FA4" stroke-width="9"/><circle cx="110" cy="250" r="62" fill="none" stroke="#FF3FA4" stroke-width="22" opacity=".25"/><path d="M265 210l56 -28M265 262h60" stroke="#35E3D0" stroke-width="9" stroke-linecap="round"/><g transform="translate(120 380)"><path d="M0 0h70l-35 60z" fill="#fff" opacity=".85" transform="rotate(-12)"/><path d="M100 0h70l-35 60z" fill="#FFD6EA" opacity=".85" transform="rotate(12 135 30)"/><g stroke="#FFF1B8" stroke-width="4" stroke-linecap="round"><path d="M85 -12v-18M70 -6l-12 -12M100 -6l12 -12"/></g></g>`,
    ),
  street: (v) =>
    SV(
      GR('k1', [
        [0, v == 'osaka' ? '#2B0B2E' : '#FF8A3D'],
        [1, v == 'osaka' ? '#E8363A' : '#E8363A'],
      ]),
      BG('k1') +
        `<g>${[...Array(8)].map((_, i) => `<path d="M${i * 50 - 5} 0h50v58q-25 -16 -50 0z" fill="${i % 2 ? '#fff' : '#FFC857'}"/>`).join('')}</g>` +
        [60, 200, 330]
          .map(
            (x, i) =>
              `<line x1="${x}" y1="58" x2="${x}" y2="100" stroke="#3a1a1a"/><ellipse cx="${x}" cy="125" rx="20" ry="26" fill="#FFC857"/><ellipse cx="${x}" cy="125" rx="32" ry="38" fill="#FFC857" opacity=".25"/>`,
          )
          .join('') +
        `<rect y="360" width="400" height="140" fill="#3a1a1a"/><rect y="350" width="400" height="20" fill="#8a4a2a"/><ellipse cx="200" cy="340" rx="90" ry="22" fill="#1a1010"/><path d="M130 335C140 270 170 280 175 230 190 280 215 250 220 215 235 270 270 270 270 335z" fill="#FF8A3D"/><path d="M160 335C170 290 195 300 200 262 212 300 235 290 240 335z" fill="#FFE08A"/><g stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6" fill="none"><path d="M100 220q-14 -30 0 -60M300 230q14 -30 0 -60"/></g>`,
    ),
  table: () =>
    SV(
      GR('l1', [
        [0, '#2E3B2A'],
        [0.5, '#C9A25A'],
        [1, '#F5D9A0'],
      ]),
      BG('l1') +
        bulbs(60, 50, 9) +
        `<path d="M-10 330Q100 270 200 310T420 290V500H-10Z" fill="#3b4a2d"/><path d="M60 480L130 300H270L340 480Z" fill="#f6efe2"/><path d="M60 480L130 300H270L340 480" stroke="#e5d6b8" stroke-width="3" fill="none"/>` +
        [150, 200, 250]
          .map(
            (x, i) =>
              `<ellipse cx="${x}" cy="${340 + (i % 2) * 6}" rx="14" ry="5" fill="#fff" stroke="#e0d2b2"/><rect x="${x - 2}" y="${316}" width="4" height="22" fill="#fff6d0"/><ellipse cx="${x}" cy="312" rx="4" ry="7" fill="#FFB84A"/><ellipse cx="${x}" cy="312" rx="14" ry="16" fill="#FFB84A" opacity=".25"/>`,
          )
          .join('') +
        `<g fill="#6b3a2a"><rect x="120" y="420" width="46" height="10" rx="5"/><rect x="235" y="420" width="46" height="10" rx="5"/></g><g fill="#4a5b38">${pine(30, 320, 0.9, '#394a2c')}${pine(380, 330, 1, '#394a2c')}</g>`,
    ),
  packed: () =>
    SV(
      GR(
        'm1',
        [
          [0, '#2A1B6E'],
          [1, '#DE007B'],
        ],
        1,
        1,
      ),
      BG('m1') +
        `<circle cx="320" cy="90" r="46" fill="#fff"/><path d="M320 90V60M320 90l22 14" stroke="#1F1E1E" stroke-width="5" stroke-linecap="round"/>` +
        [
          ['#04C9A6', 60],
          ['#734286', 130],
          ['#E47225', 200],
          ['#2EBAD3', 270],
          ['#0B91DB', 340],
        ]
          .map(
            ([c, y], i) =>
              `<rect x="${30 + (i % 2) * 40}" y="${y + 60}" width="${230 - (i % 2) * 30}" height="54" rx="16" fill="${c}"/><circle cx="${58 + (i % 2) * 40}" cy="${y + 87}" r="12" fill="#fff" opacity=".9"/><rect x="${84 + (i % 2) * 40}" y="${y + 78}" width="${100 - (i % 3) * 10}" height="8" rx="4" fill="#fff" opacity=".9"/><rect x="${84 + (i % 2) * 40}" y="${y + 94}" width="60" height="6" rx="3" fill="#fff" opacity=".5"/>`,
          )
          .join(''),
    ),
  flex: () =>
    SV(
      GR('n1', [
        [0, '#CFEFFF'],
        [1, '#FFEBD0'],
      ]),
      BG('n1') +
        `<circle cx="300" cy="110" r="44" fill="#FFE29A"/><path d="M-10 330Q120 270 220 320T420 300V500H-10Z" fill="#B9E3B0"/><path d="M-10 400Q140 350 260 410T420 390V500H-10Z" fill="#8FCB93"/><path d="M200 500C110 460 330 430 210 380S250 330 230 310" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M200 500C110 460 330 430 210 380S250 330 230 310" stroke="#F0B47A" stroke-width="3" stroke-dasharray="2 10" fill="none" stroke-linecap="round"/><g transform="translate(90 330)"><rect x="-3" y="0" width="6" height="110" fill="#6b4a3a"/><path d="M3 10h56l14 12 -14 12H3z" fill="#DE007B"/><path d="M-3 46h-48l-14 12 14 12h48z" fill="#04C9A6"/><path d="M3 82h40l12 10 -12 10H3z" fill="#E47225"/></g>`,
    ),
  boutique: () =>
    SV(
      GR('o1', [
        [0, '#FFE3EE'],
        [1, '#F6E3DA'],
      ]),
      BG('o1') +
        `<rect x="30" y="90" width="340" height="410" fill="#F6E3DA"/><rect x="30" y="90" width="340" height="30" fill="#E8C7B8"/>` +
        [60, 160, 260]
          .map(
            (x) =>
              `<g><path d="M${x} 250V190a30 30 0 0 1 60 0v60z" fill="#FFD27A"/><path d="M${x} 250V190a30 30 0 0 1 60 0v60z" fill="none" stroke="#fff" stroke-width="5"/><path d="M${x + 30} 160v90" stroke="#fff" stroke-width="3"/></g><rect x="${x - 6}" y="258" width="72" height="8" fill="#b88a7a"/><path d="M${x - 4} 266v26M${x + 12} 266v26M${x + 28} 266v26M${x + 44} 266v26M${x + 60} 266v26" stroke="#2a2220" stroke-width="3"/>`,
          )
          .join('') +
        `<path d="M30 340h340l-16 36H46z" fill="#DE007B"/><path d="M30 340h340l-16 36H46z" fill="url(#o2)" opacity="0"/>${[...Array(9)].map((_, i) => `<path d="M${46 + i * 38} 340l-8 36h19z" fill="#fff" opacity=".9"/>`).join('')}<path d="M150 500V440a50 50 0 0 1 100 0V500z" fill="#3a2a30"/><circle cx="238" cy="450" r="4" fill="#FFD27A"/><g fill="#4f8f5a"><ellipse cx="80" cy="470" rx="26" ry="30"/><ellipse cx="320" cy="470" rx="26" ry="30"/></g><g fill="#b24a31"><rect x="62" y="486" width="36" height="14" rx="3"/><rect x="302" y="486" width="36" height="14" rx="3"/></g>`,
    ),
  riad: () =>
    SV(
      GR('p1', [
        [0, '#0E5E6F'],
        [1, '#0B3C4A'],
      ]),
      BG('p1') +
        (() => {
          let o = '';
          for (let i = 0; i < 10; i++)
            for (let j = 0; j < 13; j++)
              o += `<path d="M${i * 44 + 22} ${j * 40 + 4}l14 16 -14 16 -14 -16z" fill="${(i + j) % 2 ? '#12818f' : '#C4572F'}" opacity=".55"/>`;
          return o;
        })() +
        `<path d="M90 500V220a110 110 0 0 1 220 0v280z" fill="#1d0f0a"/><path d="M90 500V220a110 110 0 0 1 220 0v280" fill="none" stroke="#E9B44C" stroke-width="10"/><path d="M118 500V222a82 82 0 0 1 164 0v278z" fill="#FFB66B"/><rect x="118" y="400" width="164" height="100" fill="#29b6c9"/><path d="M118 430h164M118 460h164" stroke="#fff" stroke-width="3" opacity=".45"/>` +
        palm(170, 300, '#12331f', 0.55) +
        [160, 240]
          .map(
            (x) =>
              `<line x1="${x}" y1="120" x2="${x}" y2="160" stroke="#E9B44C"/><path d="M${x - 12} 160h24l-4 30h-16z" fill="#E9B44C"/><ellipse cx="${x}" cy="180" rx="22" ry="26" fill="#FFD36B" opacity=".3"/>`,
          )
          .join(''),
    ),
  one: () =>
    SV(
      GR('q1', [
        [0, '#FFB7A0'],
        [0.5, '#E88DB4'],
        [1, '#7FA6E8'],
      ]),
      BG('q1') +
        `<circle cx="200" cy="130" r="50" fill="#FFF1B8" opacity=".9"/><rect y="300" width="400" height="200" fill="#2c7fb8"/><path d="M0 330h400M0 360h400" stroke="#fff" stroke-width="2" opacity=".25"/><path d="M-10 330Q110 280 220 330L320 330Q380 300 420 330V500H-10Z" fill="#F4D7A8" opacity="0"/><path d="M40 360Q120 270 230 330T400 340L400 380Q230 400 40 380Z" fill="#F4D7A8"/>${[70, 110, 150, 190, 240, 290].map((x, i) => `<rect x="${x}" y="${318 - (i % 3) * 8}" width="26" height="26" fill="${i % 2 ? '#fff' : '#FFE1C2'}"/><path d="M${x - 3} ${318 - (i % 3) * 8}l16 -12 16 12z" fill="#C65A4A"/>`).join('')}<g transform="translate(200 280)"><circle r="70" fill="#fff" opacity=".18"/><circle r="42" fill="#fff" opacity=".22"/><path d="M0 0C-22 -30 -30 -48 -30 -68a30 30 0 0 1 60 0C30 -48 22 -30 0 0z" fill="#DE007B" transform="translate(0 -20)"/><circle cx="0" cy="-88" r="11" fill="#fff"/></g>`,
    ),
  three: () =>
    SV(
      GR('r1', [
        [0, '#BEE6F7'],
        [1, '#E7F6E0'],
      ]),
      BG('r1') +
        `<path d="M-10 120Q80 60 160 110T300 70 420 150V500H-10Z" fill="#F2E7C9"/><path d="M-10 330Q120 270 230 340T420 330V500H-10Z" fill="#CDEAC4"/><path d="M220 420Q330 360 420 420V500H200Z" fill="#9AD0E8"/><path d="M100 140C200 190 60 260 150 320S290 380 300 430" stroke="#fff" stroke-width="7" fill="none" stroke-dasharray="3 16" stroke-linecap="round"/>` +
        [
          [100, 140, '#04C9A6', 'plane'],
          [150, 320, '#734286', 'train'],
          [300, 430, '#2EBAD3', 'ferry'],
        ]
          .map(
            ([x, y, c, m]) =>
              `<g transform="translate(${x} ${y})"><circle r="40" fill="${c}" opacity=".22"/><path d="M0 0C-16 -22 -22 -34 -22 -48a22 22 0 0 1 44 0C22 -34 16 -22 0 0z" fill="${c}" transform="translate(0 -10)"/><g transform="translate(-9 -68) scale(.75)" fill="#fff">${transportPaths(m)}</g></g>`,
          )
          .join(''),
    ),
  classic: () =>
    SV(
      GR('s1', [
        [0, '#FFF3DC'],
        [1, '#F5D8B8'],
      ]),
      BG('s1') +
        `<g transform="rotate(-4 200 250)"><rect x="40" y="70" width="320" height="360" rx="10" fill="#fff" stroke="#e8d8c0" stroke-width="3"/><rect x="62" y="92" width="276" height="250" rx="6" fill="#7DC7F0"/><circle cx="290" cy="140" r="26" fill="#FFE08A"/><path d="M62 342V300Q160 270 338 310V342z" fill="#9ED08A"/><path d="M200 130l-10 80h-12l-18 110h80l-18 -110h-12z" fill="#3a3340"/><path d="M178 210h44M172 250h56" stroke="#7DC7F0" stroke-width="5"/><path d="M200 112v22" stroke="#3a3340" stroke-width="4"/><rect x="62" y="360" width="150" height="8" rx="4" fill="#d8c8b0"/><rect x="62" y="380" width="120" height="8" rx="4" fill="#d8c8b0"/><g transform="translate(262 352)"><rect width="76" height="62" fill="#DE007B" stroke="#fff" stroke-width="4"/><rect x="8" y="8" width="60" height="46" fill="#FFC857" opacity=".9"/><circle cx="38" cy="31" r="12" fill="#DE007B"/></g><g fill="none" stroke="#1F1E1E" stroke-width="2.5" opacity=".6"><circle cx="262" cy="100" r="0"/></g></g>`,
    ),
  hidden: () =>
    SV(
      GR('t1', [
        [0, '#7ADCD0'],
        [1, '#25A1B8'],
      ]),
      BG('t1') +
        `<rect y="250" width="400" height="250" fill="#1B8FAA"/><path d="M0 270h400M0 300h400" stroke="#fff" stroke-width="2" opacity=".25"/><circle cx="200" cy="230" r="46" fill="#FFF1B8" opacity=".9"/><path d="M0 0H130L170 260 140 500H0Z" fill="#C98B5E"/><path d="M400 0H270L230 260 260 500H400Z" fill="#B8774E"/><path d="M130 0L170 260 140 500H100L120 260 90 0z" fill="#a9653f" opacity=".6"/>` +
        [0, 1, 2, 3, 4, 5]
          .map(
            (i) =>
              `<path d="M${150 - i * 2} ${500 - i * 44}H${250 + i * 2}V${470 - i * 44}H${150 - i * 2}z" fill="${i % 2 ? '#E3B58A' : '#d8a577'}"/>`,
          )
          .join('') +
        `<path d="M0 120Q60 150 130 110M400 140Q340 160 270 120" stroke="#2f7a46" stroke-width="10" fill="none"/><g fill="#3f9a5c"><circle cx="40" cy="132" r="9"/><circle cx="90" cy="130" r="8"/><circle cx="350" cy="148" r="9"/></g><ellipse cx="130" cy="260" rx="14" ry="18" fill="#FFD36B" opacity=".4"/>`,
    ),
};
