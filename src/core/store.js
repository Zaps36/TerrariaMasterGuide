/**
 * Application state + localStorage persistence.
 *
 * All mutations go through this module so every page stays in sync and
 * progress survives a reload. State is intentionally small and serialisable.
 */

const STORAGE_KEY = 'terraguide.state.v1';

/**
 * The polished demo state described in the spec: a Ranger in an Expert
 * Corruption world who has already cleared Eye of Cthulhu + Eater of Worlds,
 * so the app has something meaningful to say on first load.
 */
function demoState() {
  return {
    version: 1,
    setupComplete: false,
    createdAt: Date.now(),
    world: {
      difficulty: 'expert',
      evil: 'corruption',
    },
    player: {
      class: 'ranger',
    },
    /** boss id -> true */
    defeated: {
      king_slime: true,
      eye_of_cthulhu: true,
      eater_of_worlds: true,
    },
    /** arbitrary objective key -> true (checklists, world prep, potions, gear) */
    checks: {
      'gear:mobility': true,
      'gear:hp300': true,
      'boss:skeletron:heal-potions': true,
      'world:pre-hardmode:housing': true,
    },
    display: {
      reducedMotion: false,
      compact: false,
      theme: 'dark', // 'dark' (night) | 'light' (day-in-forest)
    },
  };
}

function blankState() {
  const s = demoState();
  s.defeated = {};
  s.checks = {};
  s.player.class = 'unsure';
  return s;
}

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return demoState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return demoState();
    // Shallow-merge against defaults so new fields never break an old save.
    const base = demoState();
    return {
      ...base,
      ...parsed,
      world: { ...base.world, ...(parsed.world || {}) },
      player: { ...base.player, ...(parsed.player || {}) },
      display: { ...base.display, ...(parsed.display || {}) },
      defeated: { ...(parsed.defeated || {}) },
      checks: { ...(parsed.checks || {}) },
    };
  } catch {
    return demoState();
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode) — app still works for the session */
  }
}

function emit(reason) {
  persist();
  for (const fn of [...listeners]) fn(state, reason);
}

/* ------------------------------------------------------------------ reads */

export function getState() {
  return state;
}

export function getWorld() {
  return state.world;
}

export function getPlayerClass() {
  return state.player.class;
}

export function isDefeated(bossId) {
  return Boolean(state.defeated[bossId]);
}

export function defeatedCount() {
  return Object.values(state.defeated).filter(Boolean).length;
}

export function isChecked(key) {
  return Boolean(state.checks[key]);
}

export function checkedCount(keys) {
  return keys.filter((k) => state.checks[k]).length;
}

/* ----------------------------------------------------------------- writes */

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function patch(partial, reason = 'patch') {
  state = { ...state, ...partial };
  emit(reason);
}

export function setWorld(partial) {
  state = { ...state, world: { ...state.world, ...partial } };
  emit('world');
}

export function setPlayerClass(cls) {
  state = { ...state, player: { ...state.player, class: cls } };
  emit('class');
}

export function setDisplay(partial) {
  state = { ...state, display: { ...state.display, ...partial } };
  applyDisplayPreferences();
  emit('display');
}

export function completeSetup() {
  state = { ...state, setupComplete: true };
  emit('setup');
}

export function setDefeated(bossId, value) {
  const defeated = { ...state.defeated };
  if (value) defeated[bossId] = true;
  else delete defeated[bossId];
  state = { ...state, defeated };
  emit('defeated');
}

export function toggleDefeated(bossId) {
  setDefeated(bossId, !isDefeated(bossId));
  return isDefeated(bossId);
}

export function setChecked(key, value) {
  const checks = { ...state.checks };
  if (value) checks[key] = true;
  else delete checks[key];
  state = { ...state, checks };
  emit('checks');
}

export function toggleChecked(key) {
  setChecked(key, !isChecked(key));
  return isChecked(key);
}

/** Mark a whole group of objective keys (used by "Prepare All"). */
export function setCheckedBulk(keys, value) {
  const checks = { ...state.checks };
  for (const key of keys) {
    if (value) checks[key] = true;
    else delete checks[key];
  }
  state = { ...state, checks };
  emit('checks');
}

/**
 * Replace the whole defeated map — used by the setup flow's
 * "starting progress" selector.
 */
export function setDefeatedMap(map) {
  state = { ...state, defeated: { ...map } };
  emit('defeated');
}

/* ------------------------------------------------------------------ resets */

export function resetAll() {
  state = { ...blankState(), display: state.display, setupComplete: false };
  emit('reset');
}

/** Clear every objective key that starts with one of the given prefixes. */
export function resetChecksByPrefix(prefixes) {
  const list = Array.isArray(prefixes) ? prefixes : [prefixes];
  const checks = {};
  for (const [key, value] of Object.entries(state.checks)) {
    if (!list.some((p) => key.startsWith(p))) checks[key] = value;
  }
  state = { ...state, checks };
  emit('reset-stage');
}

/* -------------------------------------------------------------- preferences */

export function applyDisplayPreferences() {
  const root = document.documentElement;
  root.classList.toggle('reduced-motion', Boolean(state.display.reducedMotion));
  root.classList.toggle('compact', Boolean(state.display.compact));
  const theme = state.display.theme === 'light' ? 'light' : 'dark';
  root.setAttribute('data-theme', theme);
  root.style.setProperty('color-scheme', theme);
}

export function getTheme() {
  return state.display.theme === 'light' ? 'light' : 'dark';
}

export function toggleTheme() {
  const next = getTheme() === 'light' ? 'dark' : 'light';
  setDisplay({ theme: next });
  return next;
}

export const storageKey = STORAGE_KEY;
