/**
 * Dashboard — answers: where am I, what should I do, what do I need,
 * what happens next (spec §10, §11, §28, §30, §45).
 */

import { h, glyph } from '../core/dom.js';
import { sprite } from '../core/sprites.js';
import { getState } from '../core/store.js';
import { CLASS_MAP, DIFFICULTY_MAP, EVIL_MAP, STAGE_MAP } from '../data/stages.js';
import {
  bossProgress,
  currentStageId,
  mainProgress,
  nextMainObjective,
  preparationProgress,
} from '../logic/progression.js';
import { mechStatus, missedThings, optionalForStage, whatNext, currentLoadout } from '../logic/recommend.js';
import { badge, btn, meter, panel, panelHead, progressBar, pageHead } from '../components/ui.js';
import { missedPanel, optionalPanel, whatNextPanel, firstStepsNudge } from '../components/recommendation.js';
import { itemCard } from '../components/item-card.js';
import { resolveItems } from '../data/items.js';

export function dashboardPage() {
  const state = getState();
  const world = state.world;
  const stageId = currentStageId(state);
  const stage = STAGE_MAP[stageId];
  const cls = CLASS_MAP[state.player.class];
  const difficulty = DIFFICULTY_MAP[world.difficulty];
  const evil = EVIL_MAP[world.evil];

  const main = mainProgress(state, world.evil);
  const bosses = bossProgress(state, world.evil);
  const prep = preparationProgress(state, world.evil);
  const mechs = mechStatus(state);
  const next = nextMainObjective(state, world.evil);
  const recommendation = whatNext(state, world);
  const missed = missedThings(state, world);
  const optional = optionalForStage(state);
  const build = currentLoadout(state);
  const objectivesDone = Object.keys(state.checks).length;

  return h(
    'div.page',

    pageHead(
      {
        eyebrow: 'TerraGuide',
        title: 'Dashboard',
        lede: 'Your path from Copper Shortsword to Moon Lord.',
      },
      btn('Edit journey', { variant: 'ghost', href: '#/setup', icon: '✎' }),
      btn('Progression map', { variant: 'ghost', href: '#/progression', icon: '🗺️' })
    ),

    h(
      'div.dash',

      /* ------------------------------------------------- YOUR JOURNEY --- */
      h(
        'section.dash__hero',
        { 'aria-label': 'Your journey' },
        h(
          'div.dash__hero-top',
          h(
            'div.grow',
            h('p.eyebrow', { style: { margin: 0 } }, 'Your journey'),
            h(
              'p.pixel-text.gold',
              { style: { margin: '4px 0 0', fontSize: '0.82rem', letterSpacing: '0.12em' } },
              `${cls.name.toUpperCase()} • ${difficulty.name.toUpperCase()} • ${evil.name.toUpperCase()}`
            ),
            h('p.tiny.dim', { style: { margin: '10px 0 0' } }, 'CURRENT STAGE'),
            h('h2.dash__stagename', stage.label),
            h('p.small.muted', { style: { margin: 0, maxWidth: '52ch' } }, stage.blurb)
          ),
          next?.boss
            ? h(
                'div.row',
                { style: { gap: '10px', alignItems: 'center' } },
                h(
                  'div',
                  { style: { textAlign: 'right' } },
                  h('p.tiny.dim', { style: { margin: 0 } }, 'NEXT'),
                  h('p.pixel-text', { style: { margin: 0, fontSize: '0.8rem' } }, next.boss.name)
                ),
                sprite(next.boss.sprite, { size: 52, alt: next.boss.name })
              )
            : sprite('moon_lord', { size: 52, alt: 'Moon Lord defeated' })
        ),
        progressBar(main.percent, {
          size: 'lg',
          label: `${main.percent}%  ·  ${main.done}/${main.total} MAIN OBJECTIVES`,
        }),
        h(
          'div.row.row--wrap',
          h('span.small.muted', next?.reason || 'You have completed the main progression.'),
          h('span.grow'),
          stage.focus.map((f) => badge(f, {}))
        )
      ),

      /* ---------------------------------------------------- two columns --- */
      h(
        'div.dash__cols',

        h(
          'div.stack',
          whatNextPanel(recommendation),

          optionalPanel(optional),

          build
            ? panel(
                { variant: 'stone' },
                panelHead(
                  `Your ${cls.name} kit right now`,
                  badge(stage.label, { variant: 'gold' }),
                  btn('Full build', { variant: 'ghost', size: 'sm', href: `#/class-builds?class=${state.player.class === 'unsure' ? 'ranger' : state.player.class}` })
                ),
                h(
                  'div.slot__items',
                  resolveItems([
                    build.weapon?.[0],
                    build.armor?.[0],
                    build.accessories?.[0],
                    build.accessories?.[1],
                    build.ammo?.[0],
                    build.potions?.[0],
                  ].filter(Boolean)).map((item, i) => itemCard(item, { tag: i === 0 ? 'best' : null }))
                )
              )
            : null
        ),

        h(
          'div.stack',

          /* ------------------------------------ YOU MAY HAVE MISSED --- */
          panel(
            { variant: 'stone' },
            panelHead(
              missed.length ? '⚠️ You may have missed' : '✓ Preparation check',
              missed.length ? badge(`${missed.length}`, { variant: 'danger' }) : badge('Clear', { variant: 'success' })
            ),
            missedPanel(missed)
          ),

          /* ------------------------------------------ YOUR PROGRESS --- */
          panel(
            { variant: 'stone' },
            panelHead('Your progress'),
            h(
              'div.progressblock',
              meter({
                label: 'Bosses defeated',
                value: `${bosses.done} / ${bosses.total}`,
                percent: bosses.percent,
                tone: 'blue',
              }),
              meter({
                label: 'Main progress',
                value: `${main.percent}%`,
                percent: main.percent,
                tone: 'gold',
              }),
              meter({
                label: 'Preparation',
                value: `${prep.done} / ${prep.total}`,
                percent: prep.percent,
                tone: 'success',
              }),
              h(
                'div.statgrid',
                h('div.stat', h('span.stat__label', 'Objectives ticked'), h('span.stat__value', `${objectivesDone}`)),
                h('div.stat', h('span.stat__label', 'Mech bosses'), h('span.stat__value', `${mechs.done} / ${mechs.total}`)),
                h('div.stat', h('span.stat__label', 'Current stage'), h('span.stat__value.stat__value--sm', stage.label)),
                h('div.stat', h('span.stat__label', 'Difficulty'), h('span.stat__value.stat__value--sm', difficulty.name))
              )
            )
          ),

          /* ------------------------------------------ WHAT'S NEXT ----- */
          panel(
            { variant: 'stone' },
            panelHead('What happens next'),
            next?.boss
              ? h(
                  'div.stack',
                  h(
                    'div.row',
                    sprite(next.boss.sprite, { size: 38, alt: '' }),
                    h(
                      'div.grow',
                      h('b.small', next.boss.name),
                      h('p.tiny.dim', { style: { margin: 0 } }, `Unlocks after this fight:`)
                    )
                  ),
                  h(
                    'ul.bullets',
                    (next.boss.unlocks || []).map((u) => h('li', u))
                  ),
                  btn('Open boss guide', { variant: 'ghost', size: 'sm', href: `#/bosses/${next.boss.id}` })
                )
              : h('p.small.muted', { style: { margin: 0 } }, 'Nothing left to unlock — you have the whole game available.')
          ),

          stageId === 'early' ? firstStepsNudge() : null,

          panel(
            { variant: 'deep' },
            panelHead('Jump to'),
            h(
              'div.row.row--wrap',
              btn('Progression', { variant: 'ghost', size: 'sm', href: '#/progression', icon: '🗺️' }),
              btn('Class builds', { variant: 'ghost', size: 'sm', href: '#/class-builds', icon: '⚔️' }),
              btn('Potions', { variant: 'ghost', size: 'sm', href: '#/potions', icon: '🧪' }),
              btn('World prep', { variant: 'ghost', size: 'sm', href: '#/world-prep', icon: '🧱' }),
              btn('Items', { variant: 'ghost', size: 'sm', href: '#/items', icon: '🧰' })
            )
          )
        )
      )
    )
  );
}
