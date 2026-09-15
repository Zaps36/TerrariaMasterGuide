/**
 * Landing page (spec §39).
 */

import { h, glyph } from '../core/dom.js';
import { sprite } from '../core/sprites.js';
import { getState } from '../core/store.js';
import { CLASS_MAP, DIFFICULTY_MAP, EVIL_MAP, STAGE_MAP } from '../data/stages.js';
import { bossProgress, currentStageId, mainProgress, nextMainObjective } from '../logic/progression.js';
import { badge, btn, panel, panelHead, progressBar } from '../components/ui.js';
import { searchIndexSize } from '../logic/search.js';
import { ITEMS } from '../data/items.js';
import { BOSSES } from '../data/bosses.js';

const FEATURES = [
  { icon: '👑', title: 'Boss Order', body: 'Know what to fight next — and what is optional.', href: '#/progression' },
  { icon: '⚔️', title: 'Class Builds', body: 'Build your character for every stage of the game.', href: '#/class-builds' },
  { icon: '🧰', title: 'Preparation', body: 'Never enter a boss fight unprepared again.', href: '#/world-prep' },
  { icon: '✓', title: 'Checklists', body: 'Track your entire journey, saved in your browser.', href: '#/dashboard' },
];

const SHOWCASE = ['eye_of_cthulhu', 'skeletron', 'wall_of_flesh', 'the_twins', 'plantera', 'golem', 'moon_lord'];

export function homePage() {
  const state = getState();
  const stage = STAGE_MAP[currentStageId(state)];
  const cls = CLASS_MAP[state.player.class];
  const difficulty = DIFFICULTY_MAP[state.world.difficulty];
  const evil = EVIL_MAP[state.world.evil];
  const main = mainProgress(state, state.world.evil);
  const bosses = bossProgress(state, state.world.evil);
  const next = nextMainObjective(state, state.world.evil);

  return h(
    'div.home',

    h(
      'section.hero',
      h('div.hero__logo', h('span.hero__mark', 'TG'), h('h1.hero__title', 'TerraGuide')),
      h('p.hero__tagline', 'Know what to do next.'),
      h('p.hero__sub', 'A progression companion for Terraria adventurers — from Copper Shortsword to Moon Lord.'),
      h(
        'div.hero__cta',
        btn('Start my journey', { variant: 'primary', size: 'lg', href: '#/setup', icon: '🧭' }),
        btn('Explore progression', { variant: 'ghost', size: 'lg', href: '#/progression', icon: '🗺️' })
      ),
      h(
        'div.hero__strip',
        badge(`${BOSSES.length} bosses & events`, { variant: 'gold' }),
        badge(`${ITEMS.length} items`, {}),
        badge(`${searchIndexSize} searchable entries`, {}),
        badge('Saves in your browser', { variant: 'success' })
      ),
      h(
        'div.hero__sprites',
        SHOWCASE.map((id) => sprite(id, { size: 40, alt: '' }))
      )
    ),

    /* live demo state so the product explains itself immediately */
    h(
      'div',
      { style: { marginTop: '26px' } },
      panel(
        { variant: 'stone' },
        panelHead(
          'Your journey so far',
          badge('Demo state loaded', { variant: 'gold' }),
          btn('Edit journey', { variant: 'ghost', size: 'sm', href: '#/setup', icon: '✎' })
        ),
        h(
          'div.grid.grid--2',
          h(
            'div.stack',
            h(
              'p.pixel-text.gold',
              { style: { margin: 0, fontSize: '0.8rem' } },
              `${cls.name.toUpperCase()} • ${difficulty.name.toUpperCase()} • ${evil.name.toUpperCase()}`
            ),
            h('p.eyebrow', { style: { margin: 0 } }, 'Current stage'),
            h('h2', { style: { margin: 0 } }, stage.label),
            progressBar(main.percent, { label: `${main.percent}% · ${main.done}/${main.total} MAIN OBJECTIVES`, size: 'lg' }),
            h('p.small.muted', { style: { margin: 0 } }, stage.blurb)
          ),
          h(
            'div.stack',
            next?.boss
              ? panel(
                  { variant: 'deep' },
                  h('p.eyebrow', { style: { margin: 0 } }, 'Next up'),
                  h(
                    'div.row',
                    sprite(next.boss.sprite, { size: 40, alt: '' }),
                    h(
                      'div.grow',
                      h('h3', { style: { margin: 0 } }, next.boss.name),
                      h('p.tiny.muted', { style: { margin: '2px 0 0' } }, next.reason)
                    )
                  ),
                  h(
                    'div',
                    { style: { marginTop: '10px' } },
                    btn('Open dashboard', { variant: 'primary', size: 'sm', href: '#/dashboard', iconAfter: '→' })
                  )
                )
              : panel(
                  { variant: 'deep' },
                  h('h3', { style: { margin: 0 } }, 'Moon Lord defeated'),
                  h('p.small.muted', 'You have finished the main progression. Time for Zenith and the endgame events.')
                ),
            h(
              'div.statgrid',
              h('div.stat', h('span.stat__label', 'Bosses defeated'), h('span.stat__value', `${bosses.done} / ${bosses.total}`)),
              h('div.stat', h('span.stat__label', 'Difficulty'), h('span.stat__value.stat__value--sm', difficulty.name)),
              h('div.stat', h('span.stat__label', 'World evil'), h('span.stat__value.stat__value--sm', evil.name))
            )
          )
        )
      )
    ),

    h('div.section-title', h('h2', 'Built for your journey')),
    h(
      'div.grid.grid--4',
      FEATURES.map((f) =>
        h(
          'a.featurecard',
          { href: f.href },
          h('span.featurecard__icon', glyph(f.icon)),
          h('h3', f.title),
          h('p', f.body)
        )
      )
    ),

    h('div.section-title', h('h2', 'How it works')),
    h(
      'div.grid.grid--3',
      [
        ['1', 'Set up your world', 'Difficulty, class, world evil and how far you have already got.'],
        ['2', 'Read your next objective', 'One clear recommendation with a preparation checklist.'],
        ['3', 'Gear up', 'Class-specific weapons, armor, accessories, ammo and potions.'],
        ['4', 'Tick the checklist', 'Progress saves automatically in your browser.'],
        ['5', 'Mark the boss defeated', 'The next recommendation appears immediately.'],
        ['6', 'Repeat to Moon Lord', 'Optional content is always flagged as optional.'],
      ].map(([num, title, body]) =>
        h(
          'div.stepitem',
          h('span.stepitem__num', num),
          h('div', h('h4.stepitem__title', title), h('p.small.muted', { style: { margin: 0 } }, body))
        )
      )
    ),

    h(
      'p.tiny.dim',
      { style: { marginTop: '32px', textAlign: 'center' } },
      'TerraGuide is an unofficial fan-made companion. Terraria is a trademark of Re-Logic. All artwork here is generated pixel art, not game assets.'
    )
  );
}
