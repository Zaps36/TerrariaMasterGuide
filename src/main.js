/**
 * TerraGuide entry point.
 *
 * Wires the shell, the router and the store together. No build step, no
 * dependencies — just ES modules.
 */

import { applyDisplayPreferences, subscribe } from './core/store.js';
import { defineRoutes, refresh, startRouter } from './core/router.js';
import { renderSky } from './components/background.js';
import { buildShell, setActiveNav } from './components/shell.js';

import { homePage } from './pages/home.js';
import { setupPage } from './pages/setup.js';
import { dashboardPage } from './pages/dashboard.js';
import { progressionPage } from './pages/progression.js';
import { bossesPage } from './pages/bosses.js';
import { bossDetailPage } from './pages/boss-detail.js';
import { classBuildsPage } from './pages/class-builds.js';
import { itemsPage } from './pages/items.js';
import { potionsPage } from './pages/potions.js';
import { npcsPage } from './pages/npcs.js';
import { resourcesPage } from './pages/resources.js';
import { worldPrepPage } from './pages/world-prep.js';
import { beginnerPage } from './pages/beginner.js';
import { settingsPage } from './pages/settings.js';
import { notFoundPage } from './pages/not-found.js';

function boot() {
  applyDisplayPreferences();
  renderSky();

  const outlet = buildShell(document.getElementById('app'));

  defineRoutes(
    [
      { path: '/', render: homePage },
      { path: '/setup', render: setupPage, reactive: false },
      { path: '/dashboard', render: dashboardPage },
      { path: '/progression', render: progressionPage },
      { path: '/bosses', render: bossesPage },
      { path: '/bosses/:id', render: bossDetailPage },
      { path: '/class-builds', render: classBuildsPage },
      { path: '/items', render: itemsPage },
      { path: '/potions', render: potionsPage },
      { path: '/npcs', render: npcsPage },
      { path: '/resources', render: resourcesPage },
      { path: '/world-prep', render: worldPrepPage },
      { path: '/beginner', render: beginnerPage },
      { path: '/settings', render: settingsPage },
    ],
    {
      notFound: notFoundPage,
      afterNavigate: ({ path }) => setActiveNav(path),
    }
  );

  startRouter(outlet);

  // Any state mutation re-renders the current page (scroll + focus preserved).
  subscribe((_state, reason) => {
    if (reason === 'display') renderSky();
    refresh();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
