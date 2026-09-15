/**
 * Settings (spec §42): world, progress and display.
 */

import { h, mount, glyph } from '../core/dom.js';
import { navigate } from '../core/router.js';
import {
  getState,
  resetAll,
  resetChecksByPrefix,
  setDisplay,
  setPlayerClass,
  setWorld,
  storageKey,
} from '../core/store.js';
import { DIFFICULTIES, PLAYER_CLASSES, STAGE_MAP, WORLD_EVILS } from '../data/stages.js';
import { currentStageId } from '../logic/progression.js';
import { badge, btn, chipGroup, openModal, pageHead, panel, panelHead, toast } from '../components/ui.js';

export function settingsPage() {
  const state = getState();
  const stageId = currentStageId(state);

  return h(
    'div.page',

    pageHead(
      {
        eyebrow: 'Settings',
        title: 'World settings',
        lede: 'Everything is stored locally in your browser. Nothing is uploaded anywhere.',
      },
      badge(STAGE_MAP[stageId].label, { variant: 'gold' }),
      btn('Run setup again', { variant: 'ghost', href: '#/setup', icon: '🧭' })
    ),

    /* -------------------------------------------------------------- world --- */
    panel(
      { variant: 'stone' },
      panelHead('World'),
      h(
        'div.stack',
        settingRow(
          'Difficulty',
          'Changes how much preparation TerraGuide insists on.',
          chipGroup({
            options: DIFFICULTIES.map((d) => ({ id: d.id, label: d.name })),
            selected: [state.world.difficulty],
            multi: false,
            onToggle: (id) => {
              setWorld({ difficulty: id });
              toast(`Difficulty set to ${DIFFICULTIES.find((d) => d.id === id).name}`, { tone: 'success' });
            },
          })
        ),
        settingRow(
          'World evil',
          'Corruption or Crimson — this filters bosses, ore and several weapons.',
          chipGroup({
            options: WORLD_EVILS.map((e) => ({ id: e.id, label: e.name })),
            selected: [state.world.evil],
            multi: false,
            onToggle: (id) => {
              setWorld({ evil: id });
              toast(`World evil set to ${WORLD_EVILS.find((e) => e.id === id).name}`, { tone: 'success' });
            },
          })
        ),
        settingRow(
          'Character class',
          'Drives every weapon, armor and accessory recommendation.',
          chipGroup({
            options: PLAYER_CLASSES.map((c) => ({ id: c.id, label: c.name })),
            selected: [state.player.class],
            multi: false,
            onToggle: (id) => {
              setPlayerClass(id);
              toast(`Class set to ${PLAYER_CLASSES.find((c) => c.id === id).name}`, { tone: 'success' });
            },
          })
        )
      )
    ),

    /* ----------------------------------------------------------- progress --- */
    h(
      'div',
      { style: { marginTop: '18px' } },
      panel(
        { variant: 'stone' },
        panelHead('Progress'),
        h(
          'div.stack',
          settingRow(
            'Reset current stage',
            `Clears only the checklists for ${STAGE_MAP[stageId].label} — bosses stay defeated.`,
            btn('Reset stage', {
              variant: 'ghost',
              onClick: () => {
                confirmDialog({
                  title: 'Reset current stage?',
                  body: 'This clears boss preparation, world preparation and potion checklists for your current stage. Defeated bosses are kept.',
                  confirmLabel: 'Reset stage',
                  onConfirm: () => {
                    resetChecksByPrefix(['boss:', 'world:', 'potion:', 'gear:']);
                    toast('Current stage checklists cleared', { tone: 'success', icon: '↩' });
                  },
                });
              },
            })
          ),
          settingRow(
            'Reset all progress',
            'Wipes every defeated boss and every checklist, and returns you to setup.',
            btn('Reset everything', {
              variant: 'danger',
              onClick: () => {
                confirmDialog({
                  title: 'Reset all progress?',
                  body: 'This cannot be undone. Every defeated boss, checklist and objective will be cleared.',
                  confirmLabel: 'Delete my progress',
                  danger: true,
                  onConfirm: () => {
                    resetAll();
                    toast('All progress reset', { icon: '🧹' });
                    navigate('/setup');
                  },
                });
              },
            })
          )
        )
      )
    ),

    /* ------------------------------------------------------------ display --- */
    h(
      'div',
      { style: { marginTop: '18px' } },
      panel(
        { variant: 'stone' },
        panelHead('Display'),
        h(
          'div.stack',
          settingRow(
            'Theme',
            'Dark mode is a Terraria night sky; light mode is a bright day in the forest.',
            chipGroup({
              options: [
                { id: 'dark', label: '🌙 Dark' },
                { id: 'light', label: '☀️ Light' },
              ],
              selected: [state.display.theme === 'light' ? 'light' : 'dark'],
              multi: false,
              onToggle: (id) => {
                setDisplay({ theme: id });
                toast(id === 'light' ? 'Light mode — day in the forest' : 'Dark mode — night sky', {
                  icon: id === 'light' ? '☀️' : '🌙',
                });
              },
            })
          ),
          settingRow(
            'Reduced animations',
            'Turns off twinkling stars, drifting clouds, pulsing nodes and sparkle effects.',
            toggle(state.display.reducedMotion, (value) => {
              setDisplay({ reducedMotion: value });
              toast(value ? 'Animations reduced' : 'Animations enabled');
            })
          ),
          settingRow(
            'Compact mode',
            'Tighter spacing and slightly smaller text — more information per screen.',
            toggle(state.display.compact, (value) => {
              setDisplay({ compact: value });
              toast(value ? 'Compact mode on' : 'Compact mode off');
            })
          )
        )
      )
    ),

    /* -------------------------------------------------------------- about --- */
    h(
      'div',
      { style: { marginTop: '18px' } },
      panel(
        { variant: 'deep' },
        panelHead('About'),
        h(
          'div.stack',
          h(
            'p.small.muted',
            { style: { margin: 0 } },
            'TerraGuide is an unofficial, fan-made progression companion. Terraria is a trademark of Re-Logic. Every sprite in this app is generated pixel art — no game assets are used.'
          ),
          h(
            'p.tiny.dim',
            { style: { margin: 0 } },
            glyph('💾'),
            ` Your data lives in localStorage under "${storageKey}". Clearing your browser data will reset it.`
          ),
          h(
            'div.row.row--wrap',
            btn('Beginner guide', { variant: 'ghost', size: 'sm', href: '#/beginner', icon: '📖' }),
            btn('Home', { variant: 'ghost', size: 'sm', href: '#/', icon: '🏠' })
          )
        )
      )
    )
  );
}

function settingRow(title, body, control) {
  return h(
    'div.settingrow',
    h(
      'div.settingrow__info',
      h('b.small', title),
      h('p.tiny.muted', { style: { margin: '2px 0 0' } }, body)
    ),
    h('div', control)
  );
}

function toggle(value, onChange) {
  const wrap = h('button.toggle', {
    type: 'button',
    class: value ? 'is-on' : null,
    'aria-pressed': value ? 'true' : 'false',
    onclick: () => onChange(!value),
  });
  mount(
    wrap,
    h('span.toggle__track', h('span.toggle__knob')),
    h('span.toggle__text', value ? 'On' : 'Off')
  );
  return wrap;
}

function confirmDialog({ title, body, confirmLabel, onConfirm, danger = false }) {
  let close = () => {};
  close = openModal({
    title,
    body: h('p.small.muted', { style: { margin: 0 } }, body),
    footer: h(
      'div.row.row--end',
      btn('Cancel', { variant: 'ghost', onClick: () => close() }),
      btn(confirmLabel, {
        variant: danger ? 'danger' : 'primary',
        onClick: () => {
          close();
          onConfirm();
        },
      })
    ),
  });
}
