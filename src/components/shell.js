/**
 * The persistent app shell: sidebar, topbar (with global search),
 * mobile drawer and bottom navigation.
 *
 * Built once at boot. The router only replaces the page outlet, which keeps
 * the search field usable while the rest of the app re-renders.
 */

import { h, mount, qsa, glyph } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { getState, subscribe } from '../core/store.js';
import { CLASS_MAP, DIFFICULTY_MAP, EVIL_MAP, STAGE_MAP } from '../data/stages.js';
import { currentStageId, mainProgress } from '../logic/progression.js';
import { searchGrouped } from '../logic/search.js';
import { spriteTile } from '../core/sprites.js';
import { tint } from '../data/tints.js';
import { MOBILE_ITEMS, NAV_ITEMS, SETTINGS_ITEM, navIdForPath } from './nav.js';
import { btn, iconBtn, progressBar } from './ui.js';

let activeNavId = 'dashboard';

/* ------------------------------------------------------------ sidebar --- */

function navLink(item) {
  return h(
    'a.navlink',
    {
      href: item.href,
      dataset: { nav: item.id },
      class: item.id === activeNavId ? 'is-active' : null,
      'aria-current': item.id === activeNavId ? 'page' : null,
    },
    h('span.navlink__icon', { 'aria-hidden': 'true' }, item.icon),
    h('span', item.label)
  );
}

function worldSummary() {
  const state = getState();
  const cls = CLASS_MAP[state.player.class] || CLASS_MAP.unsure;
  const difficulty = DIFFICULTY_MAP[state.world.difficulty];
  const evil = EVIL_MAP[state.world.evil];
  const stage = STAGE_MAP[currentStageId(state)];
  const progress = mainProgress(state, state.world.evil);

  return h(
    'div.sidebar__world',
    { dataset: { role: 'world-summary' } },
    h('span', 'Your journey'),
    h('b', `${cls.name} · ${difficulty?.name || ''}`),
    h('span', `${evil?.icon || ''} ${evil?.name || ''}`),
    h('b.gold', stage?.label || ''),
    h('div', { style: { marginTop: '6px' } }, progressBar(progress.percent, { label: `${progress.done}/${progress.total} MAIN` }))
  );
}

export function sidebar({ inDrawer = false, onNavigate = null } = {}) {
  const el = h(
    'aside.sidebar',
    { 'aria-label': 'Main navigation' },
    h(
      'a.sidebar__brand',
      { href: '#/dashboard', style: { textDecoration: 'none' } },
      h('span.sidebar__logo', 'TG'),
      h(
        'span',
        h('span.sidebar__title', { style: { display: 'block' } }, 'TerraGuide'),
        h('span.sidebar__sub', 'Progression companion')
      )
    ),
    h(
      'nav.sidebar__scroll',
      h('p.sidebar__label', 'Journey'),
      NAV_ITEMS.slice(0, 4).map(navLink),
      h('p.sidebar__label', 'Database'),
      NAV_ITEMS.slice(4, 8).map(navLink),
      h('p.sidebar__label', 'Guides'),
      NAV_ITEMS.slice(8).map(navLink)
    ),
    h('div.sidebar__footer', navLink(SETTINGS_ITEM), worldSummary())
  );

  if (inDrawer && onNavigate) {
    el.addEventListener('click', (event) => {
      if (event.target.closest('a')) onNavigate();
    });
  }
  return el;
}

/* ------------------------------------------------------- global search --- */

function globalSearch() {
  const results = h('div.search__results', { hidden: true, role: 'listbox' });
  let cursor = -1;
  let flat = [];

  const input = h('input.search__input', {
    type: 'search',
    placeholder: 'Search bosses, items, NPCs…',
    'aria-label': 'Global search',
    autocomplete: 'off',
    oninput: (event) => paint(event.target.value),
    onkeydown: (event) => {
      if (event.key === 'Escape') {
        close();
        input.blur();
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (!flat.length) return;
        cursor = event.key === 'ArrowDown'
          ? (cursor + 1) % flat.length
          : (cursor - 1 + flat.length) % flat.length;
        highlight();
      } else if (event.key === 'Enter' && cursor >= 0 && flat[cursor]) {
        event.preventDefault();
        go(flat[cursor].href);
      }
    },
    onfocus: (event) => {
      if (event.target.value.trim().length >= 2) paint(event.target.value);
    },
  });

  function highlight() {
    qsa('.search__result', results).forEach((node, index) => {
      node.classList.toggle('is-cursor', index === cursor);
      if (index === cursor) node.scrollIntoView({ block: 'nearest' });
    });
  }

  function close() {
    results.hidden = true;
    cursor = -1;
    flat = [];
  }

  function go(href) {
    close();
    input.value = '';
    navigate(href.replace(/^#/, ''));
  }

  function paint(value) {
    const groups = searchGrouped(value, 30);
    flat = groups.flatMap((g) => g.results);
    cursor = -1;

    if (!value.trim() || value.trim().length < 2) {
      close();
      return;
    }

    if (!flat.length) {
      mount(
        results,
        h('p.search__group-label', 'No results'),
        h(
          'p.small.muted',
          { style: { padding: '4px 8px 10px' } },
          'No adventurer has discovered anything matching that search.'
        )
      );
      results.hidden = false;
      return;
    }

    mount(
      results,
      groups.map((group) =>
        h(
          'div',
          h('p.search__group-label', group.label),
          group.results.map((entry) =>
            h(
              'button.search__result',
              { type: 'button', role: 'option', onclick: () => go(entry.href) },
              spriteTile(entry.sprite, { size: 22, palette: entry.tint ? tint(entry.tint) : {} }),
              h('span.grow', entry.name),
              h('span.search__result-sub', entry.kindLabel)
            )
          )
        )
      )
    );
    results.hidden = false;
  }

  const wrap = h('div.search', h('span.search__icon', '🔍'), input, results);

  document.addEventListener('click', (event) => {
    if (!wrap.contains(event.target)) close();
  });

  return wrap;
}

/* -------------------------------------------------------------- topbar --- */

function topbar(openDrawer) {
  const stageLabel = h('span.topbar__stage-name');

  function paintStage() {
    const state = getState();
    const stage = STAGE_MAP[currentStageId(state)];
    const cls = CLASS_MAP[state.player.class];
    stageLabel.textContent = `${stage?.label || ''} · ${cls?.name?.toUpperCase() || ''}`;
  }

  paintStage();
  subscribe(paintStage);

  return h(
    'header.topbar',
    iconBtnMenu(openDrawer),
    h(
      'div.topbar__stage',
      h('span.topbar__stage-label', 'Current stage'),
      stageLabel
    ),
    h('div.topbar__spacer'),
    globalSearch(),
    h(
      'div.topbar__actions',
      btn('Edit journey', { variant: 'ghost', size: 'sm', href: '#/setup', icon: '✎' })
    )
  );
}

function iconBtnMenu(openDrawer) {
  const el = iconBtn('☰', { onClick: openDrawer, label: 'Open navigation' });
  el.classList.add('topbar__menu');
  return el;
}

/* ---------------------------------------------------------- bottom nav --- */

function bottomNav() {
  return h(
    'nav.bottomnav',
    { 'aria-label': 'Primary' },
    h(
      'div.bottomnav__inner',
      MOBILE_ITEMS.map((item) =>
        h(
          'a.bottomnav__item',
          {
            href: item.href,
            dataset: { nav: item.id },
            class: item.id === activeNavId ? 'is-active' : null,
          },
          h('span', { 'aria-hidden': 'true' }, item.icon),
          h('span', item.label)
        )
      )
    )
  );
}

/* --------------------------------------------------------------- drawer --- */

function openDrawer() {
  const close = () => {
    backdrop.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (event) => {
    if (event.key === 'Escape') close();
  };
  const drawer = h('div.drawer', sidebar({ inDrawer: true, onNavigate: close }));
  const backdrop = h(
    'div.drawer-backdrop',
    {
      onclick: (event) => {
        if (event.target === backdrop) close();
      },
    },
    drawer
  );
  document.body.append(backdrop);
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onKey);
}

/* ---------------------------------------------------------------- shell --- */

/**
 * Build the shell and return the outlet the router renders into.
 */
export function buildShell(appRoot) {
  const outlet = h('div', { id: 'main-content', tabindex: '-1' });

  const shell = h(
    'div.shell',
    sidebar(),
    h('div.shell__main', topbar(openDrawer), outlet),
    bottomNav()
  );

  mount(appRoot, shell);

  // keep sidebar world summary fresh
  subscribe(() => {
    qsa('[data-role="world-summary"]', shell).forEach((node) => {
      node.replaceWith(worldSummary());
    });
  });

  return outlet;
}

/** Called by the router after every navigation. */
export function setActiveNav(path) {
  activeNavId = navIdForPath(path);
  qsa('[data-nav]').forEach((node) => {
    const isActive = node.dataset.nav === activeNavId;
    node.classList.toggle('is-active', isActive);
    if (node.classList.contains('navlink')) {
      if (isActive) node.setAttribute('aria-current', 'page');
      else node.removeAttribute('aria-current');
    }
  });
}
