/**
 * The pixel night-sky environment.
 * Generated once at boot; purely decorative and pointer-transparent.
 */

import { h, mount } from '../core/dom.js';
import { getState } from '../core/store.js';

function rand(min, max) {
  return min + Math.random() * (max - min);
}

export function renderSky() {
  const root = document.getElementById('tg-sky');
  if (!root) return;

  const reduced = getState().display.reducedMotion;

  const stars = h('div.tg-sky__stars');
  const starCount = 130;
  for (let i = 0; i < starCount; i += 1) {
    const big = Math.random() > 0.86;
    stars.append(
      h('span.tg-sky__star', {
        class: big ? 'tg-sky__star--big' : null,
        style: {
          left: `${rand(0, 100).toFixed(2)}%`,
          top: `${rand(0, 68).toFixed(2)}%`,
          animationDelay: `${rand(0, 4).toFixed(2)}s`,
          animationPlayState: reduced ? 'paused' : 'running',
        },
      })
    );
  }

  const clouds = h('div');
  for (let i = 0; i < 5; i += 1) {
    clouds.append(
      h('span.tg-sky__cloud', {
        style: {
          top: `${rand(6, 40).toFixed(1)}%`,
          width: `${Math.round(rand(40, 90))}px`,
          animationDelay: `${(-rand(0, 90)).toFixed(1)}s`,
          animationPlayState: reduced ? 'paused' : 'running',
        },
      })
    );
  }

  const trees = h('div.tg-sky__trees');
  for (let i = 0; i < 26; i += 1) {
    trees.append(
      h('span.tg-sky__tree', {
        style: { height: `${Math.round(rand(46, 90))}px`, width: `${Math.round(rand(18, 30))}px` },
      })
    );
  }

  const motes = h('div.tg-sky__particles');
  for (let i = 0; i < 16; i += 1) {
    motes.append(
      h('span.tg-sky__mote', {
        style: {
          left: `${rand(0, 100).toFixed(2)}%`,
          bottom: `${rand(-5, 25).toFixed(1)}%`,
          animationDuration: `${rand(14, 30).toFixed(1)}s`,
          animationDelay: `${(-rand(0, 20)).toFixed(1)}s`,
          animationPlayState: reduced ? 'paused' : 'running',
          background: i % 3 === 0 ? 'var(--ranger)' : 'var(--gold)',
        },
      })
    );
  }

  mount(
    root,
    stars,
    clouds,
    h('div.tg-sky__moon'),
    h('div.tg-sky__sun'),
    h('div.tg-sky__ridge.tg-sky__ridge--far'),
    h('div.tg-sky__ridge.tg-sky__ridge--near'),
    trees,
    h('div.tg-sky__ground'),
    motes
  );
}
