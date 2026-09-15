/**
 * "What should I do next?", "You may have missed" and "Optional but worth it".
 */

import { h, glyph, stars } from '../core/dom.js';
import { spriteTile } from '../core/sprites.js';
import { tint } from '../data/tints.js';
import { getItem } from '../data/items.js';
import { STAGE_MAP } from '../data/stages.js';
import { setChecked } from '../core/store.js';
import { badge, btn, checklist, panel, panelHead, callout, toast } from './ui.js';
import { defeatToggle } from './boss-card.js';

/** The signature dashboard panel. */
export function whatNextPanel(recommendation) {
  const rec = recommendation;

  return h(
    'section.whatnext',
    { 'aria-labelledby': 'whatnext-title' },
    h(
      'header.whatnext__banner',
      glyph('🧭'),
      h('span', { id: 'whatnext-title' }, 'What should I do next?')
    ),
    h(
      'div.whatnext__body',

      h(
        'div.whatnext__main',
        h('div.whatnext__portrait', spriteTile(rec.sprite, { size: 64, variant: 'gold' })),
        h(
          'div.whatnext__info',
          h('p.eyebrow', { style: { margin: 0 } }, rec.kicker),
          h('h2.whatnext__objective', `${rec.icon} ${rec.title}`),
          h('p.whatnext__why', rec.reason),
          h(
            'div.row.row--wrap',
            h('span.row', h('span.tiny.dim', 'DIFFICULTY'), stars(rec.difficulty)),
            badge(STAGE_MAP[rec.stageId]?.label || rec.stageId, { variant: 'gold' }),
            rec.boss ? badge(`${rec.boss.hp} HP recommended`, {}) : null,
            rec.boss?.when ? badge(rec.boss.when, {}) : null
          ),
          h(
            'div.row.row--wrap',
            { style: { marginTop: '14px' } },
            btn(rec.cta.label, { variant: 'primary', href: rec.cta.href, iconAfter: '→' }),
            rec.boss ? defeatToggle(rec.boss, { variant: 'ghost' }) : null,
            rec.then ? btn(rec.then.label, { variant: 'ghost', href: `#/bosses/${rec.then.boss.id}` }) : null
          )
        )
      ),

      rec.prep?.length
        ? h(
            'div.whatnext__prep',
            h('span.whatnext__prep-title', 'Before you fight'),
            checklist(rec.prep, { metaSuffix: 'COMPLETE' })
          )
        : null
    )
  );
}

/** "You may have missed" warning cards. */
export function missedPanel(missed) {
  if (!missed.length) {
    return panel(
      { variant: 'deep' },
      panelHead('✓ Nothing obvious missing'),
      h('p.small.muted', { style: { margin: 0 } }, 'Your preparation looks solid for this stage. Keep going.')
    );
  }

  const toneFor = (severity) => (severity === 'danger' ? 'danger' : severity === 'info' ? 'info' : '');

  return h(
    'div.stack',
    ...missed.slice(0, 3).map((entry) => {
      const item = entry.itemId ? getItem(entry.itemId) : null;
      return h(
        'div.callout',
        { class: toneFor(entry.severity) ? `callout--${toneFor(entry.severity)}` : null },
        h('div.callout__icon', glyph(entry.severity === 'info' ? '💡' : '⚠️')),
        h(
          'div.grow',
          h('p.callout__title', entry.title),
          h('p.small.muted', { style: { margin: '0 0 8px' } }, entry.body),
          item
            ? h(
                'div.row.row--wrap',
                { style: { marginBottom: '8px' } },
                h('span.tiny.dim', 'RECOMMENDED'),
                h(
                  'span.row',
                  spriteTile(item.sprite, { size: 22, palette: tint(item.tint) }),
                  h('b.small', item.name)
                )
              )
            : null,
          h(
            'div.row.row--wrap',
            entry.action ? btn(entry.action.label, { variant: 'ghost', size: 'sm', href: entry.action.href }) : null,
            entry.fixKey
              ? btn('Mark as done', {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: () => {
                    setChecked(entry.fixKey, true);
                    toast('Objective marked complete', { tone: 'success' });
                  },
                })
              : null
          )
        )
      );
    })
  );
}

/** "Optional but worth it" for the current stage. */
export function optionalPanel(entries) {
  if (!entries.length) {
    return panel(
      { variant: 'deep' },
      panelHead('Optional but worth it'),
      h('p.small.muted', { style: { margin: 0 } }, 'No optional detours recommended at this stage — stay on the main path.')
    );
  }

  return panel(
    { variant: 'deep' },
    panelHead('Optional but worth it', badge('Not required', { variant: 'optional' })),
    h(
      'div.stack',
      ...entries.map((entry) =>
        h(
          'div.row.row--top',
          { style: { gap: '10px' } },
          entry.boss ? spriteTile(entry.boss.sprite, { size: 32 }) : h('span.callout__icon', glyph('✨')),
          h(
            'div.grow',
            h(
              'div.row.row--wrap',
              h('b.small', entry.label),
              entry.done ? badge('Done', { variant: 'success' }) : null
            ),
            h('p.tiny.muted', { style: { margin: '2px 0 0' } }, entry.why)
          ),
          entry.boss ? btn('View', { variant: 'ghost', size: 'sm', href: `#/bosses/${entry.boss.id}` }) : null
        )
      )
    )
  );
}

/** Reusable "why this matters" nudge for empty progress. */
export function firstStepsNudge() {
  return callout({
    icon: '🌱',
    tone: 'info',
    title: 'New to Terraria?',
    body: 'The Beginner Guide walks you through the first ten steps in plain language.',
    action: btn('Open beginner guide', { variant: 'ghost', size: 'sm', href: '#/beginner' }),
  });
}
