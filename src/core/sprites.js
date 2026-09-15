/**
 * Pixel-art sprite engine.
 *
 * Sprites are hand-authored character grids. Every grid uses the same
 * symbolic palette so a single shape can be re-tinted for many items:
 *
 *   x  outline / shadow      a  primary        b  primary dark
 *   f  highlight             c  secondary      d  secondary dark
 *   e  accent                g  accent 2       w  white / glow
 *   .  transparent
 *
 * Rendering happens once per (shape + palette) pair into a cached data URL,
 * so a page with 200 item cards still only paints a handful of canvases.
 */

import { SHAPES } from '../data/sprites.js';

export const BASE_PALETTE = {
  x: '#10131c',
  a: '#8b93a5',
  b: '#5b6376',
  f: '#d7dce6',
  c: '#8a5a3b',
  d: '#5d3a25',
  e: '#f2c14e',
  g: '#e76f51',
  w: '#ffffff',
};

const urlCache = new Map();

function normalise(rows) {
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
  return { rows: rows.map((row) => row.padEnd(width, '.')), width, height: rows.length };
}

/** Render a shape to a cached PNG data URL. */
export function spriteURL(shapeName, paletteOverride = {}) {
  const shape = SHAPES[shapeName] || SHAPES.unknown;
  const palette = { ...BASE_PALETTE, ...(shape.palette || {}), ...paletteOverride };
  const key = `${shapeName}|${Object.entries(palette).map(([k, v]) => k + v).join('')}`;
  const cached = urlCache.get(key);
  if (cached) return cached;

  const { rows, width, height } = normalise(shape.rows);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const ch = rows[y][x];
      if (ch === '.' || ch === ' ') continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  const url = canvas.toDataURL('image/png');
  urlCache.set(key, url);
  return url;
}

/**
 * <img> element for a sprite.
 * @param {string} shapeName
 * @param {object} options  { size, palette, alt, className }
 */
export function sprite(shapeName, { size = 48, palette = {}, alt = '', className = '' } = {}) {
  const img = document.createElement('img');
  img.className = `sprite ${className}`.trim();
  img.src = spriteURL(shapeName, palette);
  img.width = size;
  img.height = size;
  img.alt = alt;
  img.decoding = 'async';
  if (!alt) img.setAttribute('aria-hidden', 'true');
  img.style.width = `${size}px`;
  img.style.height = `${size}px`;
  return img;
}

/** Framed sprite tile used by item cards, loadout slots and boss nodes. */
export function spriteTile(shapeName, { size = 48, palette = {}, alt = '', variant = '' } = {}) {
  const wrap = document.createElement('span');
  wrap.className = `sprite-tile ${variant ? `sprite-tile--${variant}` : ''}`.trim();
  wrap.append(sprite(shapeName, { size, palette, alt }));
  return wrap;
}

export function hasSprite(name) {
  return Boolean(SHAPES[name]);
}
