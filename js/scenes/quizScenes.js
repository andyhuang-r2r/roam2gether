/**
 * A second set of quiz illustrations, drawn in the same style as `illustrations.js`
 * (400×500 SVG, flat colour, soft gradients). Used by the "AI-written" quiz.
 * Each slot has a pair: [option A scene, option B scene].
 */
import { GR, SV, BG, palm, pine, stars, bulbs } from './illustrations.js';

export const QUIZ_SCENES = {
  /* 0 · warm vs snow */
  hammock: () =>
    SV(
      GR('n0a', [[0, '#FFD98A'], [0.55, '#FF9B6B'], [1, '#E8647C']]),
      BG('n0a') +
        `<circle cx="300" cy="170" r="60" fill="#FFF1B8"/><circle cx="300" cy="170" r="104" fill="#FFE08A" opacity=".25"/><rect y="360" width="400" height="140" fill="#F6C98F"/><path d="M-10 365Q100 345 200 365T420 360" stroke="#fff" stroke-width="5" fill="none" opacity=".6"/>` +
        palm(10, 250, '#2A1B2E', 1.05) + palm(330, 260, '#2A1B2E', 0.95) +
        `<path d="M60 330Q200 410 340 340" stroke="#2A1B2E" stroke-width="4" fill="none"/><path d="M70 335Q200 420 335 345Q200 392 70 335Z" fill="#DE007B"/><path d="M150 385q30 -20 70 0" stroke="#FFF1B8" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    ),
  cabin: () =>
    SV(
      GR('n0b', [[0, '#1E2A5A'], [1, '#6C86C8']]),
      BG('n0b') + stars(11, 50, 260) +
        `<circle cx="320" cy="90" r="28" fill="#FFF6D6"/><path d="M-10 380Q120 320 250 380T420 360V500H-10Z" fill="#EAF2FF"/><g transform="translate(110 250)"><rect y="40" width="180" height="120" fill="#8A5A3C"/><path d="M-14 46L90 -20 194 46z" fill="#F4F8FF"/><rect x="70" y="86" width="36" height="74" rx="3" fill="#5a3a26"/><rect x="18" y="70" width="34" height="34" fill="#FFD36B"/><rect x="128" y="70" width="34" height="34" fill="#FFD36B"/><rect x="140" y="-10" width="22" height="40" fill="#6a4630"/><path d="M146 -16q-10 -18 4 -30M158 -16q-10 -18 4 -30" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/></g><circle cx="200" cy="395" r="140" fill="#FFD36B" opacity=".12"/>` +
        pine(40, 420, 1.2, '#173f3a') + pine(360, 430, 1.4, '#173f3a') + pine(330, 450, 0.9, '#1f4d46'),
    ),
  /* 1 · europe vs asia */
  tram: () =>
    SV(
      GR('n1a', [[0, '#FFE3C2'], [1, '#F7B792']]),
      BG('n1a') +
        `<path d="M-10 300H110V500H-10zM290 280H420V500H290z" fill="#C97B5A"/><path d="M110 300V500H290V280z" fill="#E7A381"/><g fill="#5b2a1c" opacity=".5"><rect x="20" y="330" width="14" height="24" rx="3"/><rect x="60" y="330" width="14" height="24" rx="3"/><rect x="320" y="320" width="14" height="24" rx="3"/><rect x="362" y="320" width="14" height="24" rx="3"/></g><path d="M0 430h400" stroke="#8a4b34" stroke-width="3"/><g transform="translate(70 360)"><rect width="260" height="80" rx="16" fill="#FFC83D"/><rect x="14" y="14" width="46" height="34" rx="4" fill="#fff" opacity=".9"/><rect x="72" y="14" width="46" height="34" rx="4" fill="#fff" opacity=".9"/><rect x="130" y="14" width="46" height="34" rx="4" fill="#fff" opacity=".9"/><rect x="188" y="14" width="56" height="34" rx="4" fill="#fff" opacity=".9"/><circle cx="50" cy="84" r="10" fill="#2a2220"/><circle cx="210" cy="84" r="10" fill="#2a2220"/></g><path d="M100 120H300M130 120L110 360M270 120L290 340" stroke="#2a2220" stroke-width="2" fill="none" opacity=".5"/><circle cx="330" cy="90" r="30" fill="#FFF6D6" opacity=".9"/>`,
    ),
  lanterns: () =>
    SV(
      GR('n1b', [[0, '#1B1038'], [0.6, '#5A1C5E'], [1, '#B3305F']]),
      BG('n1b') + stars(21, 30, 200) +
        `<g transform="translate(200 250)"><path d="M-80 90L0 20 80 90z" fill="#2a1030"/><rect x="-70" y="90" width="140" height="22" fill="#3a1840"/><path d="M-100 20Q0 -50 100 20Q0 -10 -100 20z" fill="#C2473B"/><path d="M-60 -20Q0 -70 60 -20Q0 -40 -60 -20z" fill="#C2473B"/><rect x="-8" y="-60" width="16" height="30" fill="#C2473B"/></g>` +
        bulbs(110, 40, 8, '#FF6B6B') + bulbs(60, 24, 6, '#FFC857') +
        `<rect y="420" width="400" height="80" fill="#220a2c"/><path d="M0 440h400" stroke="#FFC857" stroke-width="2" opacity=".4"/>`,
    ),
  /* 2 · city vs wild */
  skyline: () =>
    SV(
      GR('n2a', [[0, '#1C1B4B'], [0.6, '#7A2A7C'], [1, '#FF8A6B']]),
      BG('n2a') + stars(31, 40, 220) +
        `<circle cx="80" cy="120" r="30" fill="#FFF1D0"/>${[[10, 200, 60], [70, 150, 54], [124, 230, 50], [174, 120, 64], [238, 190, 56], [294, 160, 50], [344, 240, 70]].map(([x, y, w], i) => `<rect x="${x}" y="${y + 40}" width="${w}" height="${460 - y}" fill="${i % 2 ? '#241447' : '#2f1a56'}"/>${Array.from({ length: 12 }, (_, k) => `<rect x="${x + 8 + (k % 3) * 16}" y="${y + 56 + Math.floor(k / 3) * 30}" width="8" height="12" rx="2" fill="#FFE08A" opacity="${(k * 7 + i * 3) % 5 > 1 ? 0.85 : 0.15}"/>`).join('')}`).join('')}<path d="M0 480h400" stroke="#FF8A6B" stroke-width="3" opacity=".6"/>`,
    ),
  tent: () =>
    SV(
      GR('n2b', [[0, '#0B1738'], [0.7, '#1E4A5F'], [1, '#2F7A6A']]),
      BG('n2b') + stars(41, 70, 300) +
        `<circle cx="300" cy="90" r="26" fill="#EAF6FF"/><path d="M-10 330L100 220 190 320 290 230 420 340V500H-10z" fill="#173B4A"/><rect y="380" width="400" height="120" fill="#12303A"/><path d="M0 410h400M0 440h400" stroke="#8fd8ea" stroke-width="2" opacity=".2"/><g transform="translate(130 300)"><path d="M0 100L70 0 140 100z" fill="#FF8A3D"/><path d="M70 0L48 100H92z" fill="#C45D1B"/></g><g transform="translate(300 380)"><path d="M0 0q12 -34 24 0z" fill="#FFC857"/><circle cx="12" cy="-4" r="30" fill="#FFC857" opacity=".25"/></g>` +
        pine(40, 400, 1.3, '#0c2a2a') + pine(360, 410, 1.5, '#0c2a2a'),
    ),
  /* 3 · beach vs mountain */
  snorkel: () =>
    SV(
      GR('n3a', [[0, '#CFF3FF'], [0.4, '#4CD0DB'], [1, '#0B6F95']]),
      BG('n3a') +
        `<circle cx="320" cy="80" r="30" fill="#FFF6C8"/><path d="M0 210Q100 190 200 210T400 200V500H0z" fill="#1CA8C4" opacity=".6"/><path d="M0 230h400M0 260h400M0 300h400" stroke="#fff" stroke-width="2" opacity=".25"/><g transform="translate(90 120)"><path d="M0 60Q90 90 190 40L170 80Q90 110 20 90z" fill="#fff"/><path d="M96 60V-20L150 50z" fill="#FFC857"/><rect x="92" y="-26" width="4" height="86" fill="#6b4a3a"/></g><g fill="#FF8A5B"><ellipse cx="110" cy="390" rx="22" ry="12"/><path d="M130 390l18 -10v20z"/></g><g fill="#FFD36B"><ellipse cx="270" cy="440" rx="16" ry="9"/><path d="M286 440l14 -8v16z"/></g><path d="M0 500Q60 450 100 500M300 500Q340 460 400 500" fill="#E2735E" opacity=".9"/><circle cx="190" cy="340" r="4" fill="#fff" opacity=".7"/><circle cx="200" cy="320" r="6" fill="#fff" opacity=".5"/>`,
    ),
  trail: () =>
    SV(
      GR('n3b', [[0, '#FFE6C9'], [1, '#CFE2FF']]),
      BG('n3b') +
        `<path d="M-10 360L90 170 150 250 230 90 320 240 420 330V500H-10z" fill="#9AA6D6"/><path d="M230 90l-38 70 26-9 12 20 14-20 26 9z" fill="#fff"/><path d="M-10 420Q120 340 240 400T420 380V500H-10z" fill="#6BA46A"/><path d="M60 500C110 450 210 450 190 400S120 350 230 300" stroke="#F4E2B8" stroke-width="14" fill="none" stroke-linecap="round"/><g transform="translate(224 240)"><rect x="4" y="-26" width="3" height="40" fill="#3a3340"/><path d="M7 -26l24 8-24 8z" fill="#DE007B"/></g>` +
        pine(40, 430, 1.1, '#1a3f35') + pine(350, 440, 1.3, '#1a3f35'),
    ),
  /* 4 · slow vs late */
  croissant: () =>
    SV(
      GR('n4a', [[0, '#FFF1DC'], [1, '#FFC7A0']]),
      BG('n4a') +
        `<rect x="250" y="40" width="130" height="200" rx="8" fill="#FFE8B0"/><path d="M315 40V240M250 140H380" stroke="#fff" stroke-width="6"/><path d="M-10 330Q200 300 410 330V500H-10z" fill="#D98A5E"/><g transform="translate(70 290)"><ellipse cx="130" cy="100" rx="150" ry="36" fill="#fff"/><path d="M40 90Q70 20 130 24T220 90Q180 70 130 70T40 90z" fill="#E8A44C"/><path d="M70 82Q90 40 130 42T190 82" stroke="#C97A2C" stroke-width="5" fill="none"/></g><g transform="translate(250 270)"><path d="M0 20h60v26a22 22 0 0 1 -22 22h-16a22 22 0 0 1 -22 -22z" fill="#fff"/><path d="M22 0q-8 -14 0 -22M40 0q-8 -14 0 -22" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></g>`,
    ),
  neon: () =>
    SV(
      GR('n4b', [[0, '#12062E'], [1, '#6A1B8A']]),
      BG('n4b') + stars(51, 40, 200) +
        `<g transform="translate(200 160)"><circle r="70" fill="#C9A7FF" opacity=".25"/><circle r="52" fill="#E9D5FF"/><g stroke="#8A4BD8" stroke-width="2" opacity=".6"><path d="M-52 0H52M0 -52V52M-37 -37L37 37M37 -37L-37 37"/></g></g><path d="M200 0V108" stroke="#C9A7FF" stroke-width="3"/><path d="M60 400L120 300 180 400zM210 400L260 280 330 400z" fill="#FF3D9A" opacity=".25"/><rect y="400" width="400" height="100" fill="#1A0A3A"/><g fill="#FF3D9A"><rect x="60" y="360" width="24" height="60" rx="8"/><circle cx="72" cy="340" r="14"/></g><g fill="#3DDCFF"><rect x="290" y="360" width="24" height="60" rx="8"/><circle cx="302" cy="340" r="14"/></g><path d="M130 430h140" stroke="#FF3D9A" stroke-width="4" stroke-linecap="round"/>`,
    ),
  /* 5 · street food vs table */
  cart: () =>
    SV(
      GR('n5a', [[0, '#FFB86B'], [1, '#E8466C']]),
      BG('n5a') + bulbs(70, 30, 8) +
        `<g transform="translate(60 230)"><path d="M0 40Q140 -30 280 40z" fill="#fff"/><path d="M0 40Q35 -4 70 28L70 40zM140 12L210 28V40H140zM70 28Q105 -2 140 12V40H70z" fill="#DE007B"/><rect x="10" y="50" width="260" height="130" fill="#7A3A2A"/><rect x="10" y="130" width="260" height="14" fill="#5a2a1c"/><g stroke="#fff" stroke-width="5" stroke-linecap="round"><path d="M50 120l8 -40M86 120l8 -40M122 120l8 -40M160 120l8 -40"/></g><circle cx="60" cy="190" r="22" fill="#2a2220"/><circle cx="220" cy="190" r="22" fill="#2a2220"/></g><path d="M120 200q-12 -30 4 -50M170 200q-12 -30 4 -50" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/><rect y="450" width="400" height="50" fill="#3a1b1b"/>`,
    ),
  feast: () =>
    SV(
      GR('n5b', [[0, '#2A1620'], [1, '#6A2A2A']]),
      BG('n5b') +
        `<circle cx="200" cy="140" r="180" fill="#FFC857" opacity=".1"/><path d="M0 330H400V380H0z" fill="#8A5A3C"/><path d="M40 380L20 500M360 380L380 500" stroke="#5a3a26" stroke-width="10"/><rect x="0" y="322" width="400" height="12" fill="#F5E6D0"/>${[60, 160, 260, 340].map((x) => `<g transform="translate(${x} 270)"><rect x="8" y="12" width="6" height="40" fill="#F7F2E8"/><path d="M0 -10h22l-2 22q-9 8 -18 0z" fill="#B3305F"/></g>`).join('')}<g transform="translate(150 285)"><ellipse cx="50" cy="30" rx="60" ry="14" fill="#fff"/><path d="M10 28Q50 -10 90 28z" fill="#E8A44C"/></g>${[40, 130, 280, 360].map((x) => `<g transform="translate(${x} 200)"><rect x="-3" y="30" width="6" height="40" fill="#FFF1B8"/><path d="M0 0q9 14 0 28q-9 -14 0 -28" fill="#FFB347"/></g>`).join('')}`,
    ),
  /* 6 · packed vs flex */
  timetable: () =>
    SV(
      GR('n6a', [[0, '#E8F1FF'], [1, '#C7D8F5']]),
      BG('n6a') +
        `<g transform="rotate(-3 200 260)"><rect x="50" y="50" width="300" height="400" rx="14" fill="#fff" stroke="#c6d4ee" stroke-width="3"/><rect x="150" y="34" width="100" height="34" rx="10" fill="#3a3340"/>${[0, 1, 2, 3, 4, 5].map((i) => `<g transform="translate(76 ${100 + i * 56})"><rect width="28" height="28" rx="6" fill="${['#DE007B', '#04C9A6', '#E47225', '#734286', '#2EBAD3', '#0B91DB'][i]}"/><path d="M7 14l7 7 12 -14" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="44" y="4" width="${150 + ((i * 37) % 70)}" height="8" rx="4" fill="#d7e0f0"/><rect x="44" y="18" width="${90 + ((i * 53) % 60)}" height="6" rx="3" fill="#e6ecf8"/></g>`).join('')}</g>`,
    ),
  paperplane: () =>
    SV(
      GR('n6b', [[0, '#FFE9B8'], [0.5, '#FFD1D1'], [1, '#C9E4FF']]),
      BG('n6b') +
        `<ellipse cx="90" cy="120" rx="70" ry="22" fill="#fff" opacity=".8"/><ellipse cx="320" cy="320" rx="80" ry="24" fill="#fff" opacity=".8"/><path d="M40 440C140 400 80 300 180 280S300 280 290 180" stroke="#fff" stroke-width="6" fill="none" stroke-dasharray="3 16" stroke-linecap="round"/><g transform="translate(250 90) rotate(20)"><path d="M0 40L120 0 60 80 50 50z" fill="#fff"/><path d="M120 0L50 50 60 80z" fill="#E4EEFA"/><path d="M0 40L50 50 120 0z" fill="#fff" stroke="#c9d8ee" stroke-width="2"/></g><path d="M-10 470Q100 420 220 470T420 450V500H-10z" fill="#8CC98C"/>`,
    ),
  /* 7 · boutique vs riad */
  lobby: () =>
    SV(
      GR('n7a', [[0, '#F6E7DA'], [1, '#E6C3A8']]),
      BG('n7a') +
        `<path d="M90 460V200a110 110 0 0 1 220 0V460z" fill="#2E3B55"/><path d="M110 460V200a90 90 0 0 1 180 0V460z" fill="#FFE8B0"/><path d="M200 110V460" stroke="#2E3B55" stroke-width="5"/><circle cx="188" cy="300" r="5" fill="#2E3B55"/><circle cx="212" cy="300" r="5" fill="#2E3B55"/><g transform="translate(150 70)"><rect width="100" height="34" rx="6" fill="#fff"/><rect x="10" y="12" width="80" height="6" rx="3" fill="#E4467C"/></g><g transform="translate(300 380)"><path d="M0 80V40h50V80z" fill="#C97B5A"/><path d="M25 40C10 10 -6 20 4 -10 20 0 25 10 25 40zM25 40C40 0 56 4 62 -24 40 -14 28 4 25 40z" fill="#3E8E5E"/></g><rect y="460" width="400" height="40" fill="#C99A78"/>`,
    ),
  courtyard: () =>
    SV(
      GR('n7b', [[0, '#FFD9A0'], [1, '#E58E5E']]),
      BG('n7b') +
        `<path d="M0 500V150a70 80 0 0 1 140 0V500zM260 500V150a70 80 0 0 1 140 0V500z" fill="#C8683B"/><path d="M30 500V160a40 55 0 0 1 80 0V500zM290 500V160a40 55 0 0 1 80 0V500z" fill="#7A2F23"/><rect x="140" y="260" width="120" height="240" fill="#F1C58A"/><g fill="none" stroke="#2EBAD3" stroke-width="3">${[0, 1, 2, 3].map((i) => `<path d="M${140 + i * 30} 380V500"/>`).join('')}</g><path d="M130 420h140" stroke="#fff" stroke-width="4" opacity=".6"/>${[160, 200, 240].map((x) => `<g transform="translate(${x} 150)"><path d="M0 -50V-10" stroke="#2a2220" stroke-width="2"/><path d="M-12 -10h24l-4 36h-16z" fill="#FFC857"/><circle cy="14" r="20" fill="#FFC857" opacity=".2"/></g>`).join('')}<path d="M170 500l30 -60 30 60z" fill="#2EBAD3" opacity=".7"/>`,
    ),
  /* 8 · one vs three */
  suitcase: () =>
    SV(
      GR('n8a', [[0, '#BFE7FF'], [1, '#FFE9C7']]),
      BG('n8a') +
        `<circle cx="300" cy="100" r="34" fill="#FFF1B8"/><rect y="320" width="400" height="180" fill="#F6DFB0"/><path d="M-10 322Q100 296 200 324T420 318" stroke="#fff" stroke-width="8" fill="none" opacity=".9"/><rect y="230" width="400" height="92" fill="#2EBAD3" opacity=".6"/><g transform="translate(110 280)"><rect width="180" height="130" rx="14" fill="#DE007B"/><rect x="60" y="-26" width="60" height="30" rx="10" fill="none" stroke="#2a2220" stroke-width="8"/><path d="M40 0V130M140 0V130" stroke="#fff" stroke-width="6" opacity=".6"/><rect x="72" y="52" width="36" height="26" rx="6" fill="#fff"/></g>${palm(320, 230, '#2A1B2E', 0.7)}`,
    ),
  trainwindow: () =>
    SV(
      GR('n8b', [[0, '#FCE4C8'], [1, '#C7E4D8']]),
      BG('n8b') +
        `<rect x="40" y="70" width="320" height="320" rx="40" fill="#734286"/><rect x="60" y="90" width="280" height="280" rx="26" fill="#BEE6F7"/><path d="M60 300Q140 240 220 290T340 260V370H60z" fill="#8CC98C"/><path d="M60 330Q160 290 340 320V370H60z" fill="#4C9A64"/><circle cx="270" cy="150" r="26" fill="#FFF1B8"/><g transform="translate(120 130)" fill="#fff" opacity=".85"><ellipse cx="30" cy="12" rx="34" ry="12"/></g><rect x="40" y="395" width="320" height="22" rx="8" fill="#5a2f6a"/><g transform="translate(140 430) rotate(-6)"><rect width="130" height="48" rx="8" fill="#fff"/><circle cx="104" cy="24" r="10" fill="#DE007B"/><rect x="14" y="12" width="70" height="8" rx="4" fill="#d9d3e0"/><rect x="14" y="28" width="50" height="6" rx="3" fill="#e8e4ee"/></g>`,
    ),
  /* 9 · classic vs hidden */
  landmark: () =>
    SV(
      GR('n9a', [[0, '#9CD6FF'], [1, '#FFF1D6']]),
      BG('n9a') +
        `<circle cx="90" cy="100" r="30" fill="#FFF6C8"/><path d="M80 430V220a120 120 0 0 1 240 0V430H270V224a70 70 0 0 0 -140 0V430z" fill="#E8D5B5"/><path d="M60 220h280v26H60z" fill="#D5BE98"/><rect y="430" width="400" height="70" fill="#C9B38C"/>${[100, 150, 250, 300, 340].map((x, i) => `<g transform="translate(${x} ${450 + (i % 2) * 14})"><circle cy="-22" r="9" fill="#3a3340"/><rect x="-8" y="-12" width="16" height="30" rx="6" fill="${['#DE007B', '#04C9A6', '#E47225', '#0B91DB', '#734286'][i]}"/></g>`).join('')}<g transform="translate(180 470)"><rect width="30" height="20" rx="4" fill="#3a3340"/><circle cx="15" cy="10" r="6" fill="#9CD6FF"/></g>`,
    ),
  alleydoor: () =>
    SV(
      GR('n9b', [[0, '#6FD6C8'], [1, '#2E9DB5']]),
      BG('n9b') +
        `<path d="M0 0H120L160 300 130 500H0z" fill="#C98B5E"/><path d="M400 0H280L240 300 270 500H400z" fill="#B8774E"/><rect x="160" y="220" width="80" height="140" rx="40" fill="#734286"/><rect x="170" y="240" width="60" height="120" rx="30" fill="#2a1030"/><circle cx="218" cy="310" r="4" fill="#FFC857"/><g transform="translate(200 190)"><path d="M0 -30V-6" stroke="#2a2220" stroke-width="2"/><path d="M-10 -6h20l-3 26h-14z" fill="#FFC857"/></g>${[0, 1, 2, 3].map((i) => `<path d="M${130 + i * 10} ${360 + i * 28}h${140 - i * 20}v16h-${140 - i * 20}z" fill="#E8C9A0"/>`).join('')}<g transform="translate(60 400)"><path d="M0 60V20h40V60z" fill="#C45D1B"/><path d="M20 20C6 -8 -8 0 0 -26 14 -16 20 -6 20 20zM20 20C34 -14 48 -10 54 -36 34 -26 24 -10 20 20z" fill="#3E8E5E"/></g>`,
    ),
};

/** The pair of scene keys for each of the ten question slots: [A, B]. */
export const QUIZ_SCENE_PAIRS = [
  ['hammock', 'cabin'],
  ['tram', 'lanterns'],
  ['skyline', 'tent'],
  ['snorkel', 'trail'],
  ['croissant', 'neon'],
  ['cart', 'feast'],
  ['timetable', 'paperplane'],
  ['lobby', 'courtyard'],
  ['suitcase', 'trainwindow'],
  ['landmark', 'alleydoor'],
];
