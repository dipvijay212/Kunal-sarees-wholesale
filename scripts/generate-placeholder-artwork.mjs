/**
 * Generates stand-in SVG artwork for the mock catalogue:
 *   public/images/products/<slug>-{1,2,3}.svg  (drape, pallu detail, border detail)
 *   public/images/collections/<slug>.svg
 *   public/images/editorial/hero-drape.svg
 *
 * Replace these with real product photography when available (same file names,
 * or update the paths in data/products.ts and data/collections.ts).
 *
 * Run: npm run generate:artwork
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

/* -------------------------------------------------------------------------- */
/* Designs                                                                    */
/* -------------------------------------------------------------------------- */

const GOLD = "#cfab62";
const SILVER = "#d3d8dc";

const designs = [
  { slug: "aaranya-katan-banarasi", base: "#5b1a2a", accent: GOLD, motif: "jaal", border: "vine", backdrop: "light" },
  { slug: "meher-tanchoi-banarasi", base: "#1f4d3f", accent: "#c7a660", motif: "paisley", border: "lines", backdrop: "light" },
  { slug: "noor-silver-zari-banarasi", base: "#1b2440", accent: SILVER, motif: "buti", border: "diamond", backdrop: "dark" },
  { slug: "vasudha-temple-border-kanjivaram", base: "#9a6b1f", accent: "#e6c67e", borderBase: "#5a1621", motif: "buti", border: "temple", backdrop: "light" },
  { slug: "ilaa-korvai-kanjivaram", base: "#1d5560", accent: "#d8b56c", borderBase: "#7a1f4a", motif: "buti", border: "temple", backdrop: "dark" },
  { slug: "saaral-checks-kanjivaram", base: "#ede6d6", accent: "#b8914f", borderBase: "#8a4b2a", motif: "checks", border: "lines", backdrop: "dark" },
  { slug: "mira-pearl-organza", base: "#d9b8b0", accent: "#fffaf5", motif: "sequin", border: "lines", backdrop: "dark" },
  { slug: "sanjh-floral-organza", base: "#a8b5a0", accent: "#eef2ea", motif: "floral", border: "vine", backdrop: "dark" },
  { slug: "tara-sequin-organza", base: "#b9cad6", accent: "#f6f9fb", motif: "sequin", border: "diamond", backdrop: "dark" },
  { slug: "rhea-sequin-georgette", base: "#17181b", accent: SILVER, motif: "sequin", border: "lines", backdrop: "light" },
  { slug: "kaia-mirror-georgette", base: "#4a2440", accent: "#dfe3e6", motif: "mirror", border: "diamond", backdrop: "light" },
  { slug: "zoya-ombre-chiffon", base: "#8f6270", ombre: "#dcb9c0", accent: "#e4e8eb", motif: "plain", border: "lines", backdrop: "light" },
  { slug: "anvi-handblock-linen", base: "#2e3d5c", accent: "#e8e4da", motif: "block", border: "lines", backdrop: "light" },
  { slug: "ira-chanderi-cotton-silk", base: "#b7be9a", accent: "#b48a3e", motif: "buti", border: "lines", backdrop: "dark" },
  { slug: "kavya-jamdani-cotton", base: "#eee9df", accent: "#3a4247", motif: "floral", border: "temple", backdrop: "dark" },
  { slug: "rajkumari-bridal-banarasi", base: "#8e1f24", accent: "#dcb660", motif: "jaal", border: "vine", backdrop: "dark" },
  { slug: "shringar-zardozi-tissue", base: "#cdb58a", accent: "#7d5f2a", motif: "floral", border: "diamond", backdrop: "dark" },
  { slug: "rukmini-bridal-kanjivaram", base: "#5a1621", accent: "#d6b164", motif: "paisley", border: "temple", backdrop: "light" },
];

const collectionCovers = {
  "banarasi-silk": "aaranya-katan-banarasi",
  "kanjivaram-weaves": "ilaa-korvai-kanjivaram",
  "organza-luxe": "tara-sequin-organza",
  "georgette-chiffon": "rhea-sequin-georgette",
  "linen-cotton": "anvi-handblock-linen",
  "bridal-couture": "rajkumari-bridal-banarasi",
};

/* -------------------------------------------------------------------------- */
/* Colour helpers                                                             */
/* -------------------------------------------------------------------------- */

const clampByte = (value) => Math.max(0, Math.min(255, Math.round(value)));
const hexToRgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.replace("#", "").slice(i, i + 2), 16));
const rgbToHex = (rgb) => `#${rgb.map((v) => clampByte(v).toString(16).padStart(2, "0")).join("")}`;
const mix = (a, b, t) => {
  const from = hexToRgb(a);
  const to = hexToRgb(b);
  return rgbToHex(from.map((v, i) => v + (to[i] - v) * t));
};
const shade = (hex, t) => mix(hex, "#000000", t);
const tint = (hex, t) => mix(hex, "#ffffff", t);
const round = (n) => Number(n.toFixed(2));

/* -------------------------------------------------------------------------- */
/* Patterns                                                                   */
/* -------------------------------------------------------------------------- */

function flower(cx, cy, size, petals = 4) {
  const shapes = [`<circle cx="0" cy="0" r="${round(size * 0.42)}"/>`];
  for (let i = 0; i < petals; i += 1) {
    const angle = (360 / petals) * i;
    shapes.push(
      `<ellipse rx="${round(size * 0.32)}" ry="${round(size * 0.85)}" transform="rotate(${angle}) translate(0 ${round(-size)})"/>`,
    );
  }
  return `<g transform="translate(${round(cx)} ${round(cy)})">${shapes.join("")}</g>`;
}

function motifPattern(id, type, color, { scale = 1, rotate = 0, opacity = 0.85 } = {}) {
  const s = (n) => round(n * scale);
  const transform = rotate ? ` patternTransform="rotate(${rotate})"` : "";
  const open = (w, h) =>
    `<pattern id="${id}" width="${s(w)}" height="${s(h)}" patternUnits="userSpaceOnUse"${transform}><g fill="${color}" stroke="${color}" opacity="${opacity}">`;
  const close = "</g></pattern>";

  switch (type) {
    case "buti":
      return `${open(64, 64)}<g stroke="none">${flower(s(16), s(16), s(4.2))}${flower(s(48), s(48), s(4.2))}</g>${close}`;
    case "jaal":
      return `${open(56, 56)}<path d="M0 ${s(28)} L${s(28)} 0 L${s(56)} ${s(28)} L${s(28)} ${s(56)} Z" fill="none" stroke-width="${s(1.1)}"/><g stroke="none">${flower(s(28), s(28), s(3.6))}<circle cx="0" cy="0" r="${s(2)}"/><circle cx="${s(56)}" cy="0" r="${s(2)}"/><circle cx="0" cy="${s(56)}" r="${s(2)}"/><circle cx="${s(56)}" cy="${s(56)}" r="${s(2)}"/></g>${close}`;
    case "paisley": {
      const drop = (x, y, angle) =>
        `<g transform="translate(${s(x)} ${s(y)}) rotate(${angle}) scale(${scale})"><path d="M0 -10 C8 -10 10 0 3 8 C0 11 -7 10 -7 3 C-7 -4 -4 -10 0 -10 Z" fill="none" stroke-width="1.3"/><circle cx="-1" cy="1" r="2.4" stroke="none"/></g>`;
      return `${open(72, 72)}${drop(18, 20, 25)}${drop(54, 56, 205)}${close}`;
    }
    case "checks":
      return `${open(40, 40)}<path d="M0 0 H${s(40)} M0 0 V${s(40)}" stroke-width="${s(1.6)}" fill="none"/><path d="M0 ${s(20)} H${s(40)} M${s(20)} 0 V${s(40)}" stroke-width="${s(0.6)}" fill="none" opacity="0.6"/>${close}`;
    case "floral": {
      const leaf = (x, y, angle) =>
        `<path transform="translate(${s(x)} ${s(y)}) rotate(${angle}) scale(${scale})" d="M0 0 C6 -6 14 -6 18 0 C14 6 6 6 0 0 Z" stroke="none"/>`;
      return `${open(90, 90)}<g stroke="none">${flower(s(24), s(24), s(5), 5)}${flower(s(69), s(69), s(5), 5)}</g>${leaf(32, 30, 30)}${leaf(16, 18, 210)}${leaf(77, 75, 30)}${leaf(61, 63, 210)}${close}`;
    }
    case "sequin":
      return `${open(36, 36)}<g stroke="none"><circle cx="${s(6)}" cy="${s(8)}" r="${s(1.9)}"/><circle cx="${s(24)}" cy="${s(4)}" r="${s(1.4)}" opacity="0.6"/><circle cx="${s(16)}" cy="${s(20)}" r="${s(2.1)}"/><circle cx="${s(31)}" cy="${s(26)}" r="${s(1.5)}" opacity="0.7"/><circle cx="${s(8)}" cy="${s(31)}" r="${s(1.2)}" opacity="0.5"/></g>${close}`;
    case "mirror":
      return `${open(48, 48)}<circle cx="${s(12)}" cy="${s(12)}" r="${s(4.5)}" fill="none" stroke-width="${s(1.3)}"/><circle cx="${s(12)}" cy="${s(12)}" r="${s(2)}" stroke="none" opacity="0.7"/><circle cx="${s(36)}" cy="${s(36)}" r="${s(4.5)}" fill="none" stroke-width="${s(1.3)}"/><circle cx="${s(36)}" cy="${s(36)}" r="${s(2)}" stroke="none" opacity="0.7"/>${close}`;
    case "block":
      return `${open(44, 44)}<g stroke="none"><path d="M${s(22)} ${s(13)} L${s(31)} ${s(22)} L${s(22)} ${s(31)} L${s(13)} ${s(22)} Z"/><circle cx="${s(4)}" cy="${s(4)}" r="${s(1.6)}"/><circle cx="${s(40)}" cy="${s(4)}" r="${s(1.6)}"/><circle cx="${s(4)}" cy="${s(40)}" r="${s(1.6)}"/><circle cx="${s(40)}" cy="${s(40)}" r="${s(1.6)}"/></g>${close}`;
    default:
      return "";
  }
}

function borderPattern(id, type, color, { vertical = false, scale = 1 } = {}) {
  const s = (n) => round(n * scale);
  const transform = vertical ? ` patternTransform="rotate(90)"` : "";
  const open = (w, h) =>
    `<pattern id="${id}" width="${s(w)}" height="${s(h)}" patternUnits="userSpaceOnUse"${transform}><g fill="${color}" stroke="${color}">`;
  const close = "</g></pattern>";

  switch (type) {
    case "temple":
      return `${open(36, 60)}<rect x="0" y="${s(4)}" width="${s(36)}" height="${s(2.5)}" stroke="none"/><path d="M0 ${s(46)} L${s(18)} ${s(16)} L${s(36)} ${s(46)} Z" stroke="none" opacity="0.9"/><rect x="0" y="${s(52)}" width="${s(36)}" height="${s(2.5)}" stroke="none"/>${close}`;
    case "vine":
      return `${open(60, 60)}<rect x="0" y="${s(6)}" width="${s(60)}" height="${s(1.6)}" stroke="none"/><path d="M0 ${s(30)} C${s(15)} ${s(16)} ${s(30)} ${s(44)} ${s(45)} ${s(30)} S${s(60)} ${s(16)} ${s(60)} ${s(30)}" fill="none" stroke-width="${s(1.6)}"/><circle cx="${s(15)}" cy="${s(22)}" r="${s(3)}" stroke="none"/><circle cx="${s(45)}" cy="${s(38)}" r="${s(3)}" stroke="none"/><rect x="0" y="${s(52)}" width="${s(60)}" height="${s(1.6)}" stroke="none"/>${close}`;
    case "diamond":
      return `${open(30, 60)}<rect x="0" y="${s(6)}" width="${s(30)}" height="${s(1.4)}" stroke="none"/><path d="M${s(15)} ${s(16)} L${s(24)} ${s(30)} L${s(15)} ${s(44)} L${s(6)} ${s(30)} Z" stroke="none"/><rect x="0" y="${s(52)}" width="${s(30)}" height="${s(1.4)}" stroke="none"/>${close}`;
    default:
      return `${open(20, 60)}<g stroke="none"><rect x="0" y="${s(8)}" width="${s(20)}" height="${s(3)}"/><rect x="0" y="${s(17)}" width="${s(20)}" height="${s(1)}" opacity="0.7"/><rect x="0" y="${s(42)}" width="${s(20)}" height="${s(1)}" opacity="0.7"/><rect x="0" y="${s(49)}" width="${s(20)}" height="${s(3)}"/></g>${close}`;
  }
}

/** Alternating light/dark stops that read as soft vertical folds in silk. */
function foldGradient(id, { x2 = 1, y2 = 0, strength = 1 } = {}) {
  const stops = [
    [0, "#000", 0.34],
    [0.1, "#fff", 0.1],
    [0.22, "#000", 0.2],
    [0.36, "#fff", 0.16],
    [0.5, "#000", 0.1],
    [0.62, "#fff", 0.12],
    [0.76, "#000", 0.22],
    [0.88, "#fff", 0.07],
    [1, "#000", 0.32],
  ];
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${round(a * strength)}"/>`)
    .join("")}</linearGradient>`;
}

function svgDocument(width, height, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${body}</svg>\n`;
}

/* -------------------------------------------------------------------------- */
/* Compositions                                                               */
/* -------------------------------------------------------------------------- */

function bodyFill(d, id) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${d.base}"/><stop offset="1" stop-color="${d.ombre ?? shade(d.base, 0.12)}"/></linearGradient>`;
}

/** Image 1: full saree hanging from a rod against a studio backdrop. */
function drapeImage(d) {
  const W = 900;
  const H = 1200;
  const dark = d.backdrop === "dark";
  const borderBase = d.borderBase ?? shade(d.accent, 0.15);
  const drape =
    "M235 160 L665 160 C690 430 735 760 765 1050 Q705 1082 645 1056 Q585 1090 522 1060 Q460 1094 398 1060 Q336 1090 276 1056 Q206 1082 138 1050 C168 760 212 430 235 160 Z";
  const band = "M612 150 L710 150 C735 430 780 760 810 1110 L716 1110 C688 780 646 450 612 150 Z";

  const defs = [
    `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark ? "#1d2225" : "#f1f2f3"}"/><stop offset="0.78" stop-color="${dark ? "#131618" : "#dde1e3"}"/><stop offset="1" stop-color="${dark ? "#0d0f10" : "#cfd4d7"}"/></linearGradient>`,
    `<radialGradient id="spot" cx="0.5" cy="0.35" r="0.65"><stop offset="0" stop-color="#fff" stop-opacity="${dark ? 0.07 : 0.55}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`,
    bodyFill(d, "body"),
    motifPattern("motif", d.motif, d.accent, { opacity: 0.7 }),
    motifPattern("pallu", d.motif === "plain" ? "sequin" : d.motif, d.accent, { scale: 0.75, opacity: 0.9 }),
    borderPattern("border", d.border, d.accent, { vertical: true, scale: 0.8 }),
    borderPattern("hem", d.border, d.accent, { scale: 0.9 }),
    foldGradient("folds"),
    `<linearGradient id="top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.32"/><stop offset="0.14" stop-color="#000" stop-opacity="0"/></linearGradient>`,
    `<clipPath id="drape"><path d="${drape}"/></clipPath>`,
    `<filter id="blur" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="14"/></filter>`,
  ].join("");

  const motifLayer = d.motif === "plain" ? "" : `<rect x="100" y="150" width="720" height="960" fill="url(#motif)"/>`;

  const body = [
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>`,
    `<rect width="${W}" height="${H}" fill="url(#spot)"/>`,
    `<ellipse cx="452" cy="1098" rx="320" ry="22" fill="#000" opacity="${dark ? 0.5 : 0.22}" filter="url(#blur)"/>`,
    `<g clip-path="url(#drape)">`,
    `<rect x="100" y="150" width="720" height="960" fill="url(#body)"/>`,
    motifLayer,
    `<rect x="100" y="800" width="720" height="310" fill="${shade(d.ombre ?? d.base, 0.1)}"/>`,
    `<rect x="100" y="800" width="720" height="310" fill="url(#pallu)"/>`,
    `<rect x="100" y="800" width="720" height="44" fill="${borderBase}"/>`,
    `<rect x="100" y="800" width="720" height="44" fill="url(#hem)"/>`,
    `<path d="${band}" fill="${borderBase}"/>`,
    `<path d="${band}" fill="url(#border)"/>`,
    `<rect x="100" y="150" width="720" height="960" fill="url(#folds)"/>`,
    `<rect x="100" y="150" width="720" height="960" fill="url(#top)"/>`,
    `</g>`,
    `<path d="${drape}" fill="none" stroke="#000" stroke-opacity="0.12" stroke-width="1.5"/>`,
    `<path d="M450 146 V112 C450 90 476 90 476 108" fill="none" stroke="${dark ? "#aeb6bb" : "#2a3135"}" stroke-width="4" stroke-linecap="round"/>`,
    `<rect x="196" y="144" width="508" height="12" rx="6" fill="${dark ? "#c9cfd3" : "#2a3135"}"/>`,
  ].join("");

  return svgDocument(W, H, defs, body);
}

/** Image 2 and collection covers: full-bleed pallu close-up with a diagonal border. */
function palluImage(d, { width = 900, height = 1200, angle = -16, bandY = 760 } = {}) {
  const borderBase = d.borderBase ?? shade(d.accent, 0.15);
  const motifType = d.motif === "plain" ? "sequin" : d.motif;
  const defs = [
    bodyFill(d, "body"),
    motifPattern("motif", motifType, d.accent, { scale: 1.35, rotate: angle, opacity: 0.85 }),
    borderPattern("border", d.border, d.accent, { scale: 1.6 }),
    foldGradient("folds", { x2: 1, y2: 0.4, strength: 1.1 }),
    `<radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient>`,
  ].join("");

  const cx = width / 2;
  const cy = height / 2;
  const body = [
    `<rect width="${width}" height="${height}" fill="url(#body)"/>`,
    `<rect width="${width}" height="${height}" fill="url(#motif)"/>`,
    `<g transform="rotate(${angle} ${cx} ${cy})">`,
    `<rect x="-400" y="${bandY - 12}" width="${width + 800}" height="4" fill="${d.accent}" opacity="0.9"/>`,
    `<rect x="-400" y="${bandY}" width="${width + 800}" height="96" fill="${borderBase}"/>`,
    `<rect x="-400" y="${bandY}" width="${width + 800}" height="96" fill="url(#border)"/>`,
    `<rect x="-400" y="${bandY + 104}" width="${width + 800}" height="4" fill="${d.accent}" opacity="0.9"/>`,
    `<rect x="-400" y="${bandY + 116}" width="${width + 800}" height="${height}" fill="${shade(d.ombre ?? d.base, 0.18)}"/>`,
    `<rect x="-400" y="${bandY + 116}" width="${width + 800}" height="${height}" fill="url(#motif)" opacity="0.6"/>`,
    `</g>`,
    `<rect width="${width}" height="${height}" fill="url(#folds)"/>`,
    `<rect width="${width}" height="${height}" fill="url(#vignette)"/>`,
  ].join("");

  return svgDocument(width, height, defs, body);
}

/** Image 3: close-up of the woven border and tasselled edge. */
function borderImage(d) {
  const W = 900;
  const H = 1200;
  const borderBase = d.borderBase ?? shade(d.accent, 0.15);
  const defs = [
    bodyFill(d, "body"),
    d.motif === "plain" ? "" : motifPattern("motif", d.motif, d.accent, { scale: 1.8, opacity: 0.75 }),
    borderPattern("border", d.border, d.accent, { scale: 3 }),
    foldGradient("folds", { x2: 0.3, y2: 1, strength: 0.9 }),
    `<radialGradient id="vignette" cx="0.5" cy="0.45" r="0.8"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></radialGradient>`,
  ].join("");

  const tassels = Array.from({ length: 40 }, (_, i) => {
    const x = -200 + i * 34;
    return `<path d="M${x} 1010 C${x + 4} 1060 ${x - 4} 1110 ${x + 2} 1200" stroke="${tint(borderBase, 0.1)}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
  }).join("");

  const body = [
    `<rect width="${W}" height="${H}" fill="url(#body)"/>`,
    d.motif === "plain" ? "" : `<rect width="${W}" height="${H}" fill="url(#motif)"/>`,
    `<g transform="rotate(5 450 600)">`,
    `<rect x="-300" y="600" width="1500" height="8" fill="${d.accent}"/>`,
    `<rect x="-300" y="620" width="1500" height="200" fill="${borderBase}"/>`,
    `<rect x="-300" y="620" width="1500" height="200" fill="url(#border)"/>`,
    `<rect x="-300" y="832" width="1500" height="8" fill="${d.accent}"/>`,
    `<rect x="-300" y="850" width="1500" height="160" fill="${shade(d.ombre ?? d.base, 0.2)}"/>`,
    `<rect x="-300" y="1000" width="1500" height="14" fill="${borderBase}"/>`,
    tassels,
    `</g>`,
    `<rect width="${W}" height="${H}" fill="url(#folds)"/>`,
    `<rect width="${W}" height="${H}" fill="url(#vignette)"/>`,
  ].join("");

  return svgDocument(W, H, defs, body);
}

/** Homepage hero: charcoal silk ribbons with a cool silver sheen. */
function heroImage() {
  const W = 1600;
  const H = 1000;
  const ribbons = [
    { d: "M820 -60 C1020 180 960 420 1180 620 S1480 900 1680 1060 L1680 860 C1500 780 1380 560 1300 400 S1140 40 1060 -60 Z", stops: ["#15191b", "#2a3135", "#8b979d", "#252b2f", "#111416"] },
    { d: "M1040 -60 C1180 140 1160 360 1340 520 S1620 700 1700 760 L1700 520 C1620 470 1500 380 1440 260 S1320 20 1260 -60 Z", stops: ["#111416", "#3a4247", "#c3d3da", "#2e363a", "#15191b"] },
    { d: "M700 1060 C860 900 1040 860 1220 900 S1520 1000 1700 940 L1700 1060 Z", stops: ["#0f1214", "#1f2528", "#6f7d84", "#1c2124", "#0f1214"] },
    { d: "M1220 -60 C1300 60 1360 180 1480 260 S1660 340 1700 360 L1700 -60 Z", stops: ["#15191b", "#2a3135", "#a9cfdd", "#2a3135", "#15191b"] },
  ];

  const defs = [
    `<radialGradient id="glow" cx="0.72" cy="0.35" r="0.55"><stop offset="0" stop-color="#7ea3b4" stop-opacity="0.28"/><stop offset="1" stop-color="#7ea3b4" stop-opacity="0"/></radialGradient>`,
    ...ribbons.map(
      (ribbon, i) =>
        `<linearGradient id="r${i}" x1="0" y1="0" x2="1" y2="0.6">${ribbon.stops
          .map((color, j) => `<stop offset="${j / (ribbon.stops.length - 1)}" stop-color="${color}"/>`)
          .join("")}</linearGradient>`,
    ),
    borderPattern("zari", "vine", "#c9d6dc", { scale: 0.9 }),
    `<clipPath id="ribbon1"><path d="${ribbons[1].d}"/></clipPath>`,
  ].join("");

  const body = [
    `<rect width="${W}" height="${H}" fill="#111416"/>`,
    `<rect width="${W}" height="${H}" fill="url(#glow)"/>`,
    ...ribbons.map((ribbon, i) => `<path d="${ribbon.d}" fill="url(#r${i})"/>`),
    `<g clip-path="url(#ribbon1)" opacity="0.18" transform="rotate(0)"><rect x="1000" y="-60" width="700" height="900" fill="url(#zari)" transform="rotate(38 1350 400)"/></g>`,
    `<path d="M1040 -60 C1180 140 1160 360 1340 520 S1620 700 1700 760" fill="none" stroke="#e3feff" stroke-opacity="0.35" stroke-width="1.4"/>`,
    `<path d="M820 -60 C1020 180 960 420 1180 620 S1480 900 1680 1060" fill="none" stroke="#a9cfdd" stroke-opacity="0.22" stroke-width="1.2"/>`,
  ].join("");

  return svgDocument(W, H, defs, body);
}

/* -------------------------------------------------------------------------- */
/* Write files                                                                */
/* -------------------------------------------------------------------------- */

function write(relativePath, contents) {
  const filePath = join(publicDir, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, contents);
}

const designsBySlug = new Map(designs.map((design) => [design.slug, design]));
let count = 0;

for (const design of designs) {
  write(`images/products/${design.slug}-1.svg`, drapeImage(design));
  write(`images/products/${design.slug}-2.svg`, palluImage(design));
  write(`images/products/${design.slug}-3.svg`, borderImage(design));
  count += 3;
}

for (const [collectionSlug, productSlug] of Object.entries(collectionCovers)) {
  const design = designsBySlug.get(productSlug);
  if (!design) throw new Error(`Unknown design for collection cover: ${productSlug}`);
  write(`images/collections/${collectionSlug}.svg`, palluImage(design, { width: 960, height: 1200, angle: -24, bandY: 520 }));
  count += 1;
}

write("images/editorial/hero-drape.svg", heroImage());
count += 1;

console.log(`Generated ${count} placeholder artwork files in public/images`);
