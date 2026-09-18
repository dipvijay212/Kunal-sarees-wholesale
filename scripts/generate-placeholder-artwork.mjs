/**
 * Generates the homepage hero artwork:
 *   public/images/editorial/hero-drape.svg
 *
 * Product, collection and category imagery comes from a remote CDN
 * (see data/images.ts). public/images/fallback/product.svg is the local
 * fallback rendered when a remote image fails to load.
 *
 * Run: npm run generate:artwork
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const round = (n) => Number(n.toFixed(2));

/** Repeating zari band, used as a faint overlay on one silk ribbon. */
function zariPattern(id, color, { scale = 1 } = {}) {
  const s = (n) => round(n * scale);
  return [
    `<pattern id="${id}" width="${s(60)}" height="${s(60)}" patternUnits="userSpaceOnUse">`,
    `<g fill="${color}" stroke="${color}">`,
    `<rect x="0" y="${s(6)}" width="${s(60)}" height="${s(1.6)}" stroke="none"/>`,
    `<path d="M0 ${s(30)} C${s(15)} ${s(16)} ${s(30)} ${s(44)} ${s(45)} ${s(30)} S${s(60)} ${s(16)} ${s(60)} ${s(30)}" fill="none" stroke-width="${s(1.6)}"/>`,
    `<circle cx="${s(15)}" cy="${s(22)}" r="${s(3)}" stroke="none"/>`,
    `<circle cx="${s(45)}" cy="${s(38)}" r="${s(3)}" stroke="none"/>`,
    `<rect x="0" y="${s(52)}" width="${s(60)}" height="${s(1.6)}" stroke="none"/>`,
    "</g></pattern>",
  ].join("");
}

function svgDocument(width, height, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${body}</svg>\n`;
}

/** Charcoal silk ribbons with a cool silver sheen and a faint icy glow. */
function heroImage() {
  const W = 1600;
  const H = 1000;
  const ribbons = [
    {
      d: "M820 -60 C1020 180 960 420 1180 620 S1480 900 1680 1060 L1680 860 C1500 780 1380 560 1300 400 S1140 40 1060 -60 Z",
      stops: ["#15191b", "#2a3135", "#8b979d", "#252b2f", "#111416"],
    },
    {
      d: "M1040 -60 C1180 140 1160 360 1340 520 S1620 700 1700 760 L1700 520 C1620 470 1500 380 1440 260 S1320 20 1260 -60 Z",
      stops: ["#111416", "#3a4247", "#c3d3da", "#2e363a", "#15191b"],
    },
    {
      d: "M700 1060 C860 900 1040 860 1220 900 S1520 1000 1700 940 L1700 1060 Z",
      stops: ["#0f1214", "#1f2528", "#6f7d84", "#1c2124", "#0f1214"],
    },
    {
      d: "M1220 -60 C1300 60 1360 180 1480 260 S1660 340 1700 360 L1700 -60 Z",
      stops: ["#15191b", "#2a3135", "#a9cfdd", "#2a3135", "#15191b"],
    },
  ];

  const defs = [
    `<radialGradient id="glow" cx="0.72" cy="0.35" r="0.55"><stop offset="0" stop-color="#7ea3b4" stop-opacity="0.28"/><stop offset="1" stop-color="#7ea3b4" stop-opacity="0"/></radialGradient>`,
    ...ribbons.map(
      (ribbon, i) =>
        `<linearGradient id="r${i}" x1="0" y1="0" x2="1" y2="0.6">${ribbon.stops
          .map((color, j) => `<stop offset="${j / (ribbon.stops.length - 1)}" stop-color="${color}"/>`)
          .join("")}</linearGradient>`,
    ),
    zariPattern("zari", "#c9d6dc", { scale: 0.9 }),
    `<clipPath id="ribbon1"><path d="${ribbons[1].d}"/></clipPath>`,
  ].join("");

  const body = [
    `<rect width="${W}" height="${H}" fill="#111416"/>`,
    `<rect width="${W}" height="${H}" fill="url(#glow)"/>`,
    ...ribbons.map((ribbon, i) => `<path d="${ribbon.d}" fill="url(#r${i})"/>`),
    `<g clip-path="url(#ribbon1)" opacity="0.18"><rect x="1000" y="-60" width="700" height="900" fill="url(#zari)" transform="rotate(38 1350 400)"/></g>`,
    `<path d="M1040 -60 C1180 140 1160 360 1340 520 S1620 700 1700 760" fill="none" stroke="#e3feff" stroke-opacity="0.35" stroke-width="1.4"/>`,
    `<path d="M820 -60 C1020 180 960 420 1180 620 S1480 900 1680 1060" fill="none" stroke="#a9cfdd" stroke-opacity="0.22" stroke-width="1.2"/>`,
  ].join("");

  return svgDocument(W, H, defs, body);
}

function write(relativePath, contents) {
  const filePath = join(publicDir, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, contents);
}

write("images/editorial/hero-drape.svg", heroImage());
console.log("Generated public/images/editorial/hero-drape.svg");
