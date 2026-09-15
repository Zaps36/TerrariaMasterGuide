import { h } from '../core/dom.js';
import { sprite } from '../core/sprites.js';
import { btn, emptyState, panel } from '../components/ui.js';

export function notFoundPage({ path }) {
  return h(
    'div.page',
    panel(
      { variant: 'stone' },
      emptyState({
        title: 'Nothing here',
        body: `No page matches "${path}". Even the Dungeon has fewer dead ends than this.`,
        art: sprite('unknown', { size: 64 }),
        action: h(
          'div.row.row--wrap',
          btn('Dashboard', { variant: 'primary', href: '#/dashboard', icon: '🏠' }),
          btn('Progression', { variant: 'ghost', href: '#/progression', icon: '🗺️' })
        ),
      })
    )
  );
}
