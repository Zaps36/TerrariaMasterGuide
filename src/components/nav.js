export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', href: '#/dashboard' },
  { id: 'progression', label: 'Progression', icon: '🗺️', href: '#/progression' },
  { id: 'bosses', label: 'Bosses', icon: '👑', href: '#/bosses' },
  { id: 'class-builds', label: 'Class Builds', icon: '⚔️', href: '#/class-builds' },
  { id: 'items', label: 'Items', icon: '🧰', href: '#/items' },
  { id: 'potions', label: 'Potions', icon: '🧪', href: '#/potions' },
  { id: 'npcs', label: 'NPCs', icon: '🏠', href: '#/npcs' },
  { id: 'resources', label: 'Resources', icon: '⛏️', href: '#/resources' },
  { id: 'world-prep', label: 'World Prep', icon: '🧱', href: '#/world-prep' },
  { id: 'beginner', label: 'Beginner Guide', icon: '📖', href: '#/beginner' },
];

export const SETTINGS_ITEM = {
  id: 'settings',
  label: 'World Settings',
  icon: '⚙️',
  href: '#/settings',
};

export const MOBILE_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: '🏠', href: '#/dashboard' },
  { id: 'progression', label: 'Path', icon: '🗺️', href: '#/progression' },
  { id: 'bosses', label: 'Bosses', icon: '👑', href: '#/bosses' },
  { id: 'class-builds', label: 'Builds', icon: '⚔️', href: '#/class-builds' },
  { id: 'items', label: 'Items', icon: '🧰', href: '#/items' },
];

/** Map a route path to the nav id that should be highlighted. */
export function navIdForPath(path) {
  if (path === '/' || path.startsWith('/home')) return 'home';
  const segment = path.split('/')[1] || 'dashboard';
  if (segment === 'setup') return 'settings';
  return segment;
}
