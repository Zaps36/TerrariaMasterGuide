/**
 * Item database (spec §18) with type / class / progression filters.
 */

import { h, mount } from '../core/dom.js';
import { getState } from '../core/store.js';
import {
  ITEMS,
  ITEM_CLASS_FILTERS,
  ITEM_TYPE_FILTERS,
  PROGRESSION_FILTERS,
  filterItems,
  sortByProgression,
} from '../data/items.js';
import { badge, btn, chipGroup, emptyState, pageHead, panel, searchInput } from '../components/ui.js';
import { itemGridCard, openItemModal } from '../components/item-card.js';
import { sprite } from '../core/sprites.js';

export function itemsPage({ query } = {}) {
  const state = getState();

  let search = query?.get('q')?.replace(/\+/g, ' ') || '';
  let types = [];
  let classes = [];
  let buckets = [];
  let hideOtherEvil = true;

  // Deep link: #/items?item=terra_blade opens the modal directly.
  const deepItem = query?.get('item');
  if (deepItem) setTimeout(() => openItemModal(deepItem), 30);

  const controls = h('div');
  const results = h('div');

  function paint() {
    const list = sortByProgression(
      filterItems({
        types,
        classes,
        buckets,
        query: search,
        evil: hideOtherEvil ? state.world.evil : null,
      })
    );

    if (!list.length) {
      mount(
        results,
        panel(
          {},
          emptyState({
            title: 'Nothing found',
            body: 'No adventurer has discovered anything matching that search.',
            art: sprite('unknown', { size: 56 }),
            action: btn('Clear filters', { variant: 'ghost', onClick: reset }),
          })
        )
      );
      return;
    }

    mount(
      results,
      h('p.tiny.dim', { style: { margin: '0 0 12px' } }, `${list.length} of ${ITEMS.length} items`),
      h('div.grid.grid--3', list.map((item) => itemGridCard(item)))
    );
  }

  function reset() {
    types = [];
    classes = [];
    buckets = [];
    search = '';
    paintControls();
    paint();
  }

  function toggler(arrayName) {
    return (id) => {
      const map = { types, classes, buckets };
      const next = map[arrayName].includes(id)
        ? map[arrayName].filter((x) => x !== id)
        : [...map[arrayName], id];
      if (arrayName === 'types') types = next;
      if (arrayName === 'classes') classes = next;
      if (arrayName === 'buckets') buckets = next;
      paintControls();
      paint();
    };
  }

  function paintControls() {
    mount(
      controls,
      h(
        'div.filterbar',
        searchInput({
          placeholder: 'Search items…',
          value: search,
          focusKey: 'item-search',
          onInput: (value) => {
            search = value;
            paint();
          },
        }),
        types.length || classes.length || buckets.length || search
          ? btn('Reset', { variant: 'ghost', size: 'sm', onClick: reset })
          : null
      ),
      panel(
        { variant: 'deep' },
        h(
          'div.stack',
          { style: { gap: '10px' } },
          chipGroup({ label: 'Type', options: ITEM_TYPE_FILTERS, selected: types, onToggle: toggler('types') }),
          chipGroup({ label: 'Class', options: ITEM_CLASS_FILTERS, selected: classes, onToggle: toggler('classes') }),
          chipGroup({ label: 'Progression', options: PROGRESSION_FILTERS, selected: buckets, onToggle: toggler('buckets') }),
          h(
            'div.row.row--wrap',
            h('span.filtergroup__label', 'World evil'),
            h(
              'button.chip',
              {
                type: 'button',
                class: hideOtherEvil ? 'is-active' : null,
                'aria-pressed': hideOtherEvil ? 'true' : 'false',
                onclick: () => {
                  hideOtherEvil = !hideOtherEvil;
                  paintControls();
                  paint();
                },
              },
              hideOtherEvil ? `Hiding non-${state.world.evil} items` : 'Showing all items'
            )
          )
        )
      )
    );
  }

  paintControls();
  paint();

  return h(
    'div.page',
    pageHead(
      {
        eyebrow: 'Database',
        title: 'Items',
        lede: 'Weapons, armor, accessories, ammo, potions and materials — filtered to what actually matters at each stage.',
      },
      badge(`${ITEMS.length} entries`, {}),
      btn('Accessory chains', { variant: 'ghost', href: '#/class-builds', icon: '🔗' })
    ),
    controls,
    h('div', { style: { marginTop: '16px' } }, results)
  );
}
