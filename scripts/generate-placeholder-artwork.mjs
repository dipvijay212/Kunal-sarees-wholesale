/**
 * Generates the homepage hero artwork:
 *   public/images/editorial/hero-drape.svg
 *
 * Warm luxury Indian textile jacquard & zari pattern.
 * Run: npm run generate:artwork
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const round = (n) => Number(n.toFixed(2));

/** Repeating Indian Zari / Paisley motif */
function zariPattern(id, color, { scale = 1 } = {}) {
  const s = (n) => round(n * scale);
  return [
    `<pattern id="${id}" width="${s(80)}" height="${s(80)}" patternUnits="userSpaceOnUse">`,
    `<g fill="none" stroke="${color}" stroke-width="${s(1.2)}" opacity="0.65">`,
    `<path d="M${s(40)} ${s(10)} C${s(55)} ${s(25)} ${s(55)} ${s(45)} ${s(40)} ${s(60)} C${s(25)} ${s(45)} ${s(25)} ${s(25)} ${s(40)} ${s(10)} Z"/>`,
    `<circle cx="${s(40)}" cy="${s(35)}" r="${s(4)}" fill="${color}"/>`,
    `<path d="M${s(10)} ${s(40)} Q${s(25)} ${s(40)} ${s(40)} ${s(25)} T${s(70)} ${s(40)}"/>`,
    `<path d="M0 ${s(78)} L${s(80)} ${s(78)}"/>`,
    `<path d="M0 ${s(2)} L${s(80)} ${s(2)}"/>`,
    `</g></pattern>`,
  ].join("");
}

function svgDocument(width, height, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${body}</svg>\n`;
}

/** Warm luxury Indian textile backdrop */
function heroImage() {
  const W = 1600;
  const H = 1000;

  const defs = [
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FAF5EE"/><stop offset="50%" stop-color="#F3E8DA"/><stop offset="100%" stop-color="#EEDCC8"/></linearGradient>`,
    `<radialGradient id="goldGlow" cx="0.8" cy="0.4" r="0.6"><stop offset="0%" stop-color="#D6B878" stop-opacity="0.35"/><stop offset="100%" stop-color="#FAF5EE" stop-opacity="0"/></radialGradient>`,
    `<radialGradient id="maroonGlow" cx="0.2" cy="0.8" r="0.5"><stop offset="0%" stop-color="#6E1F2A" stop-opacity="0.08"/><stop offset="100%" stop-color="#FAF5EE" stop-opacity="0"/></radialGradient>`,
    zariPattern("zari", "#B38A4A", { scale: 1 }),
  ].join("");

  const body = [
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>`,
    `<rect width="${W}" height="${H}" fill="url(#goldGlow)"/>`,
    `<rect width="${W}" height="${H}" fill="url(#maroonGlow)"/>`,
    `<rect width="${W}" height="${H}" fill="url(#zari)" opacity="0.45"/>`,
    `<path d="M0 800 C400 700 800 850 1200 750 S1600 820 1600 820 L1600 1000 L0 1000 Z" fill="#F3E8DA" opacity="0.6"/>`,
    `<path d="M0 820 C400 720 800 870 1200 770 S1600 840 1600 840" stroke="#B38A4A" stroke-width="1.5" stroke-opacity="0.3" fill="none"/>`,
  ].join("");

  return svgDocument(W, H, defs, body);
}

function write(relativePath, contents) {
  const filePath = join(publicDir, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, contents);
}

write("images/editorial/hero-drape.svg", heroImage());
console.log("Generated warm luxury public/images/editorial/hero-drape.svg");

