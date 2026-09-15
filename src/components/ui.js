/**
 * Reusable pixel UI components.
 * Everything here is presentation-only — no game knowledge.
 */

import { h, frag, mount, stars, glyph, nextFrame } from '../core/dom.js';
import { isChecked, toggleChecked, setCheckedBulk, getState } from '../core/store.js';

/* --------------------------------------------------------------- surfaces */

export function panel({ variant = '', accent = null, className = '', tag = 'div' } = {}, ...children) {
  const classes = ['panel'];
  if (variant) variant.split(' ').filter(Boolean).forEach((v) => classes.push(`panel--${v}`));
  if (className) classes.push(className);
  return h(
    `${tag}.${classes.join('.')}`,
    accent ? { style: { '--accent': accent } } : null,
    ...children
  );
}

export function panelHead(title, ...actions) {
  return h(
    'div.panel__head',
    typeof title === 'string' ? h('h3', title) : title,
    actions.length ? h('div.panel__head-actions', ...actions) : null
  );
}

export function sectionTitle(text, ...actions) {
  return h('div.section-title', h('h2', text), ...actions);
}

export function pageHead({ eyebrow, title, lede }, ...actions) {
  return h(
    'header.pagehead',
    h(
      'div.pagehead__text',
      eyebrow ? h('p.eyebrow', eyebrow) : null,
      h('h1', title),
      lede ? h('p.lede', lede) : null
    ),
    actions.length ? h('div.pagehead__actions', ...actions) : null
  );
}

/* ---------------------------------------------------------------- buttons */

export function btn(label, { variant = '', href = null, onClick = null, size = '', icon = null, iconAfter = null, block = false, disabled = false, title = null, focusKey = null } = {}) {
  const classes = ['btn'];
  if (variant) classes.push(`btn--${variant}`);
  if (size) classes.push(`btn--${size}`);
  if (block) classes.push('btn--block');

  const props = {
    class: classes.slice(1),
    title,
    dataset: focusKey ? { focusKey } : null,
  };

  const kids = [icon ? glyph(icon) : null, label, iconAfter ? glyph(iconAfter) : null];

  if (href) {
    return h('a.btn', { ...props, href, 'aria-disabled': disabled ? 'true' : null }, ...kids);
  }
  return h('button.btn', { ...props, type: 'button', onclick: onClick, disabled: disabled || null }, ...kids);
}

export function iconBtn(icon, { onClick, label, variant = 'ghost' } = {}) {
  return h(
    `button.btn.btn--${variant}.btn--icon`,
    { type: 'button', onclick: onClick, 'aria-label': label, title: label },
    glyph(icon)
  );
}

/* ----------------------------------------------------------------- badges */

export function badge(label, { variant = '', cls = null, icon = null } = {}) {
  return h(
    'span.badge',
    { class: variant ? `badge--${variant}` : null, dataset: cls ? { class: cls } : null },
    icon ? glyph(icon) : null,
    label
  );
}

const RARITY_NAMES = {
  gray: 'Gray',
  white: 'White',
  blue: 'Blue',
  green: 'Green',
  orange: 'Orange',
  red: 'Red',
  pink: 'Pink',
  purple: 'Purple',
  lime: 'Lime',
  yellow: 'Yellow',
  cyan: 'Cyan',
  rainbow: 'Expert',
};

export function rarityBadge(rarity) {
  return h('span.rarity', { dataset: { rarity } }, `◆ ${RARITY_NAMES[rarity] || rarity}`);
}

export function difficultyStars(value) {
  return stars(value);
}

/* --------------------------------------------------------------- progress */

export function progressBar(percent, { tone = 'gold', label = null, size = '' } = {}) {
  const pct = Math.max(0, Math.min(100, Math.round(percent || 0)));
  const fill = h('div.progress__fill', { dataset: { tone }, style: { width: '0%' } });
  nextFrame(() => {
    fill.style.width = `${pct}%`;
  });
  return h(
    `div.progress${size ? `.progress--${size}` : ''}`,
    { role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': '0', 'aria-valuemax': '100' },
    fill,
    label === false ? null : h('div.progress__label', label ?? `${pct}%`)
  );
}

export function meter({ label, value, percent, tone = 'gold' }) {
  return h(
    'div.meter',
    h('div.meter__top', h('span', label), h('span.meter__value', value)),
    progressBar(percent, { tone, label: false })
  );
}

/* -------------------------------------------------------------- checklist */

/**
 * Interactive, persistent checklist.
 * @param {Array<{key:string,label:string,note?:string,side?:Node}>} entries
 */
export function checklist(entries, { onChange = null, showMeta = true, metaSuffix = 'COMPLETE' } = {}) {
  const done = entries.filter((e) => isChecked(e.key)).length;

  const list = h(
    'div.checklist',
    { role: 'group' },
    entries.map((entry) =>
      h(
        'button.check',
        {
          type: 'button',
          class: isChecked(entry.key) ? 'is-done' : null,
          'aria-pressed': isChecked(entry.key) ? 'true' : 'false',
          dataset: { focusKey: `check:${entry.key}` },
          onclick: (event) => {
            const now = toggleChecked(entry.key);
            if (now) sparkleBurst(event.currentTarget);
            if (onChange) onChange(entry.key, now);
          },
        },
        h('span.check__box', { 'aria-hidden': 'true' }, '✓'),
        h(
          'span.check__label',
          entry.label,
          entry.note ? h('span.check__note', entry.note) : null
        ),
        entry.side ? h('span.check__side', entry.side) : null
      )
    )
  );

  if (!showMeta) return list;

  return frag(
    list,
    h(
      'div.checklist__meta',
      h('span', { class: done === entries.length ? 'success' : null }, `${done} / ${entries.length} ${metaSuffix}`),
      progressBarInline(entries.length ? (done / entries.length) * 100 : 0),
      btn('Prepare all', {
        variant: 'ghost',
        size: 'sm',
        onClick: () => setCheckedBulk(entries.map((e) => e.key), true),
      }),
      done > 0
        ? btn('Clear', {
            variant: 'ghost',
            size: 'sm',
            onClick: () => setCheckedBulk(entries.map((e) => e.key), false),
          })
        : null
    )
  );
}

function progressBarInline(percent) {
  return h('div', { style: { flex: '1 1 120px', minWidth: '90px' } }, progressBar(percent, { label: false }));
}

/* ------------------------------------------------------------------- tabs */

/**
 * Tab strip that swaps content in place.
 * @param {Array<{id:string,label:string,icon?:string,cls?:string}>} items
 * @param {(id:string)=>Node} render
 */
/** Remembers the selected tab across page re-renders. */
const tabMemory = new Map();

export function tabs(items, render, { initial = null, onSwitch = null, ariaLabel = 'Tabs', persist = true } = {}) {
  const remembered = persist ? tabMemory.get(ariaLabel) : null;
  const valid = (id) => items.some((item) => item.id === id);
  let active = (valid(remembered) && remembered) || (valid(initial) && initial) || items[0]?.id;
  if (persist) tabMemory.set(ariaLabel, active);
  const body = h('div.tabbody');
  const strip = h('div.tabs', { role: 'tablist', 'aria-label': ariaLabel });

  function paint() {
    mount(strip, ...items.map((item) =>
      h(
        'button.tab',
        {
          type: 'button',
          role: 'tab',
          'aria-selected': item.id === active ? 'true' : 'false',
          class: item.id === active ? 'is-active' : null,
          dataset: { class: item.cls || null, focusKey: `tab:${ariaLabel}:${item.id}` },
          onclick: () => {
            if (active === item.id) return;
            active = item.id;
            if (persist) tabMemory.set(ariaLabel, active);
            paint();
            mount(body, render(active));
            if (onSwitch) onSwitch(active);
          },
        },
        item.icon ? glyph(item.icon) : null,
        item.label
      )
    ));
  }

  paint();
  mount(body, render(active));
  return frag(strip, body);
}

/* ------------------------------------------------------------------ modal */

let openModals = 0;

export function openModal({ title, subtitle, body, footer, sprite = null }) {
  const root = document.getElementById('modal-root');
  const previousFocus = document.activeElement;

  const close = () => {
    backdrop.remove();
    openModals -= 1;
    if (openModals === 0) document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  };

  const onKey = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      close();
    }
  };

  const dialog = h(
    'div.modal',
    { role: 'dialog', 'aria-modal': 'true', 'aria-label': typeof title === 'string' ? title : 'Details' },
    h(
      'div.modal__head',
      sprite,
      h(
        'div',
        h('h2.modal__title', title),
        subtitle ? h('p.small.muted', { style: { margin: '2px 0 0' } }, subtitle) : null
      ),
      h('button.modal__close', { type: 'button', 'aria-label': 'Close', onclick: close }, '✕')
    ),
    h('div.modal__body', body),
    footer ? h('div.modal__body', { style: { paddingTop: '0' } }, footer) : null
  );

  const backdrop = h(
    'div.modal-backdrop',
    {
      onclick: (event) => {
        if (event.target === backdrop) close();
      },
    },
    dialog
  );

  root.append(backdrop);
  openModals += 1;
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onKey);
  dialog.querySelector('.modal__close')?.focus();
  return close;
}

/* ------------------------------------------------------------------ toast */

export function toast(message, { tone = '', icon = '✓', duration = 2400 } = {}) {
  const root = document.getElementById('toast-root');
  const node = h('div.toast', { class: tone ? `toast--${tone}` : null }, glyph(icon), message);
  root.append(node);
  setTimeout(() => {
    node.classList.add('is-out');
    setTimeout(() => node.remove(), 260);
  }, duration);
}

/* ---------------------------------------------------------------- sparkle */

export function sparkleBurst(anchor) {
  if (getState().display.reducedMotion) return;
  const rect = anchor.getBoundingClientRect();
  const cx = rect.left + Math.min(rect.width, 40) / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#F2C14E', '#72D572', '#F4F1DE', '#6CB4EE'];

  for (let i = 0; i < 7; i += 1) {
    const dx = (Math.random() - 0.5) * 60;
    const dy = -18 - Math.random() * 34;
    const dot = h('span.sparkle', {
      style: {
        left: `${cx}px`,
        top: `${cy}px`,
        background: colors[i % colors.length],
        '--dx': `${dx}px`,
        '--dy': `${dy}px`,
        animationDelay: `${i * 18}ms`,
      },
    });
    document.body.append(dot);
    setTimeout(() => dot.remove(), 900);
  }
}

/* ------------------------------------------------------------ empty state */

export function emptyState({ title, body, art = null, action = null }) {
  return h(
    'div.empty',
    art ? h('div.empty__art', art) : null,
    h('p.empty__title', title),
    body ? h('p', body) : null,
    action
  );
}

/* --------------------------------------------------------------- stat grid */

export function statGrid(entries) {
  return h(
    'div.statgrid',
    entries.map(([label, value]) =>
      h('div.stat', h('span.stat__label', label), h('span.stat__value', value))
    )
  );
}

export function kv(entries) {
  return h(
    'dl.kv',
    entries.flatMap(([term, value]) => [h('dt', term), h('dd', value)])
  );
}

export function bullets(items, { variant = '' } = {}) {
  return h(
    `ul.bullets${variant ? `.bullets--${variant}` : ''}`,
    items.map((item) => h('li', item))
  );
}

/* ---------------------------------------------------------------- callout */

export function callout({ icon = '⚠️', title, body, tone = '', action = null }) {
  return h(
    'div.callout',
    { class: tone ? `callout--${tone}` : null },
    h('div.callout__icon', glyph(icon)),
    h(
      'div.grow',
      title ? h('p.callout__title', title) : null,
      body ? h('p.small.muted', { style: { margin: 0 } }, body) : null,
      action ? h('div', { style: { marginTop: '10px' } }, action) : null
    )
  );
}

/* --------------------------------------------------------------- chip row */

export function chipGroup({ label, options, selected, onToggle, multi = true }) {
  return h(
    'div.filtergroup',
    label ? h('span.filtergroup__label', label) : null,
    options.map((option) =>
      h(
        'button.chip',
        {
          type: 'button',
          class: selected.includes(option.id) ? 'is-active' : null,
          'aria-pressed': selected.includes(option.id) ? 'true' : 'false',
          dataset: { focusKey: `chip:${label}:${option.id}` },
          onclick: () => onToggle(option.id, multi),
        },
        option.label
      )
    )
  );
}

export function searchInput({ placeholder = 'Search…', value = '', onInput, focusKey = 'search' }) {
  const input = h('input.search__input', {
    type: 'search',
    placeholder,
    value,
    'aria-label': placeholder,
    dataset: { focusKey },
    oninput: (event) => onInput(event.target.value),
  });
  return h('div.search', h('span.search__icon', '🔍'), input);
}
