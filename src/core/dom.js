/**
 * Tiny DOM helper layer.
 * Keeps the rest of the app declarative without pulling in a framework.
 */

const SVG_TAGS = new Set(['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs', 'linearGradient', 'stop', 'ellipse']);

/**
 * Create an element.
 *   h('div.card#main', { onclick }, 'text', child)
 *   h('button.pixel-btn', { class: 'is-active', disabled: true })
 *
 * Supported props:
 *   class / className  -> extra classes (string or array)
 *   style              -> object of css properties
 *   dataset            -> object of data attributes
 *   html               -> innerHTML (only used with trusted, app-authored markup)
 *   on<event>          -> addEventListener
 *   anything else      -> setAttribute (aria-*, href, role, ...)
 */
export function h(selector, props, ...children) {
  const { tag, id, classes } = parseSelector(selector);
  const el = SVG_TAGS.has(tag)
    ? document.createElementNS('http://www.w3.org/2000/svg', tag)
    : document.createElement(tag);

  if (id) el.id = id;
  for (const c of classes) el.classList.add(c);

  if (props && typeof props === 'object' && !isRenderable(props)) {
    applyProps(el, props);
  } else if (props !== undefined && props !== null) {
    children.unshift(props);
  }

  append(el, children);
  return el;
}

function parseSelector(selector) {
  if (typeof selector !== 'string') return { tag: 'div', id: '', classes: [] };
  const idMatch = selector.match(/#([\w-]+)/);
  const classes = [...selector.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
  const tag = selector.match(/^[a-zA-Z][\w-]*/)?.[0] || 'div';
  return { tag, id: idMatch ? idMatch[1] : '', classes };
}

function applyProps(el, props) {
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;

    if (key === 'class' || key === 'className') {
      const list = Array.isArray(value) ? value : String(value).split(/\s+/);
      list.filter(Boolean).forEach((c) => el.classList.add(c));
    } else if (key === 'style' && typeof value === 'object') {
      Object.entries(value).forEach(([k, v]) => {
        if (v === null || v === undefined) return;
        if (k.startsWith('--')) el.style.setProperty(k, String(v));
        else el.style[k] = v;
      });
    } else if (key === 'dataset' && typeof value === 'object') {
      Object.entries(value).forEach(([k, v]) => {
        if (v !== null && v !== undefined) el.dataset[k] = String(v);
      });
    } else if (key === 'html') {
      el.innerHTML = value;
    } else if (key === 'text') {
      el.textContent = String(value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'ref' && typeof value === 'function') {
      value(el);
    } else if (value === true) {
      el.setAttribute(key, '');
    } else {
      el.setAttribute(key, String(value));
    }
  }
}

function isRenderable(v) {
  return v instanceof Node || Array.isArray(v);
}

function append(el, children) {
  for (const child of children.flat(4)) {
    if (child === null || child === undefined || child === false || child === true) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

/** Document fragment from a list of children. */
export function frag(...children) {
  const f = document.createDocumentFragment();
  append(f, children);
  return f;
}

/** Remove all children of a node. */
export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

/** Replace the content of a node. */
export function mount(node, ...children) {
  clear(node);
  append(node, children);
  return node;
}

export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

/** Event delegation helper. */
export function delegate(root, eventName, selector, handler) {
  root.addEventListener(eventName, (event) => {
    const target = event.target.closest(selector);
    if (target && root.contains(target)) handler(event, target);
  });
}

/** Small emoji / glyph icon wrapper so sizing stays consistent. */
export function glyph(char, label) {
  return h('span.glyph', { 'aria-hidden': label ? null : 'true', role: label ? 'img' : null, 'aria-label': label || null }, char);
}

/** Star rating: ★★★☆☆ (also exposes an accessible label). */
export function stars(value, max = 5) {
  const filled = Math.max(0, Math.min(max, Math.round(value || 0)));
  return h(
    'span.stars',
    { role: 'img', 'aria-label': `${filled} out of ${max}` },
    h('span.stars__on', '★'.repeat(filled)),
    h('span.stars__off', '☆'.repeat(max - filled))
  );
}

/** requestAnimationFrame-batched callback. */
export function nextFrame(fn) {
  requestAnimationFrame(() => requestAnimationFrame(fn));
}
