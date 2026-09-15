/**
 * Hash-based router — works from a static host and from file:// alike.
 * Routes are plain patterns: '/bosses/:id'.
 */

const routes = [];
let notFoundRender = () => null;
let onNavigate = () => {};

export function defineRoutes(list, { notFound, afterNavigate } = {}) {
  routes.length = 0;
  for (const route of list) routes.push({ ...route, matcher: toMatcher(route.path) });
  if (notFound) notFoundRender = notFound;
  if (afterNavigate) onNavigate = afterNavigate;
}

function toMatcher(path) {
  const keys = [];
  const pattern = path
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      if (segment.startsWith(':')) {
        keys.push(segment.slice(1));
        return '([^/]+)';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });
  return { regex: new RegExp(`^/${pattern.join('/')}/?$`), keys };
}

export function currentPath() {
  const raw = window.location.hash.replace(/^#/, '');
  const path = raw.split('?')[0];
  return path && path.startsWith('/') ? path : '/';
}

export function currentQuery() {
  const raw = window.location.hash.replace(/^#/, '');
  const qIndex = raw.indexOf('?');
  return new URLSearchParams(qIndex >= 0 ? raw.slice(qIndex + 1) : '');
}

export function navigate(path, { replace = false } = {}) {
  const target = `#${path}`;
  if (window.location.hash === target) {
    render();
    return;
  }
  if (replace) window.history.replaceState(null, '', target);
  else window.history.pushState(null, '', target);
  render();
}

export function resolve(path) {
  for (const route of routes) {
    const match = path.match(route.matcher.regex);
    if (match) {
      const params = {};
      route.matcher.keys.forEach((key, i) => {
        params[key] = decodeURIComponent(match[i + 1]);
      });
      return { route, params };
    }
  }
  return null;
}

let outlet = null;
let renderScheduled = false;

export function startRouter(targetEl) {
  outlet = targetEl;
  window.addEventListener('hashchange', render);
  window.addEventListener('popstate', render);
  render();
}

/** Re-render the current route (used when global state changes). */
export function refresh() {
  if (renderScheduled) return;
  renderScheduled = true;
  requestAnimationFrame(() => {
    renderScheduled = false;
    render({ keepScroll: true, fromState: true });
  });
}

function render({ keepScroll = false, fromState = false } = {}) {
  if (!outlet) return;
  const path = currentPath();
  const found = resolve(path);

  // Some views (the setup wizard) own their internal state and must not be
  // rebuilt when the store changes.
  if (fromState && found && found.route.reactive === false) return;

  const scrollEl = document.scrollingElement || document.documentElement;
  const previousScroll = scrollEl.scrollTop;
  const focusKey = document.activeElement?.dataset?.focusKey || null;

  const view = found
    ? found.route.render({ params: found.params, query: currentQuery(), path })
    : notFoundRender({ path });

  outlet.replaceChildren(view || document.createTextNode(''));
  onNavigate({ path, route: found?.route ?? null, params: found?.params ?? {} });

  if (keepScroll) scrollEl.scrollTop = previousScroll;
  else scrollEl.scrollTop = 0;

  if (focusKey) {
    const restored = outlet.querySelector(`[data-focus-key="${cssEscape(focusKey)}"]`);
    if (restored) restored.focus({ preventScroll: true });
  }
}

function cssEscape(value) {
  if (window.CSS?.escape) return window.CSS.escape(value);
  return value.replace(/["\\]/g, '\\$&');
}
