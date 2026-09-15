#!/usr/bin/env node
/**
 * Dependency-free single-file build.
 *
 * Produces dist/terraguide.html — one self-contained document with the CSS
 * and the whole ES module graph inlined, so it runs by double-clicking it
 * (file://) with no server and no network.
 *
 * How it works: the module graph is topologically sorted, `import` lines are
 * dropped, the `export` keyword is stripped, and everything is concatenated
 * into a single IIFE. This is only safe because the source deliberately keeps
 * one unique top-level name per declaration — `npm run check` verifies that.
 *
 * Usage: node build.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const ENTRY = join(ROOT, 'src/main.js');
const OUT_DIR = join(ROOT, 'dist');
const OUT_FILE = join(OUT_DIR, 'terraguide.html');

/* ------------------------------------------------------------- utilities */

function listJsFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listJsFiles(full) : full.endsWith('.js') ? [full] : [];
  });
}

/**
 * Split a module into its import specifiers and its body with import lines
 * removed and `export ` stripped.
 */
function parseModule(file) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const deps = [];
  const body = [];

  let pendingImport = false;
  for (const line of lines) {
    if (pendingImport) {
      const match = line.match(/from\s+['"]([^'"]+)['"]/);
      if (match) {
        deps.push(match[1]);
        pendingImport = false;
      }
      continue;
    }

    if (/^\s*import\s/.test(line)) {
      const match = line.match(/from\s+['"]([^'"]+)['"]/);
      if (match) deps.push(match[1]);
      else pendingImport = true;
      continue;
    }

    body.push(line.replace(/^export\s+(?=(async\s+)?(function|const|let|var|class)\b)/, ''));
  }

  return { deps, code: body.join('\n') };
}

/** Depth-first topological sort of the module graph. */
function collectModules(entry) {
  const parsed = new Map();
  const order = [];
  const visiting = new Set();

  function visit(file) {
    const key = resolve(file);
    if (parsed.has(key)) return;
    if (visiting.has(key)) {
      throw new Error(`Circular import detected at ${relative(ROOT, key)}`);
    }
    visiting.add(key);

    const mod = parseModule(key);
    parsed.set(key, mod);
    for (const dep of mod.deps) {
      if (!dep.startsWith('.')) throw new Error(`Bare import "${dep}" is not supported (${key})`);
      visit(resolve(dirname(key), dep));
    }

    visiting.delete(key);
    order.push(key);
  }

  visit(entry);
  return order.map((key) => ({ file: key, ...parsed.get(key) }));
}

/** Guard against the one thing that can break flattening. */
function assertNoDuplicateTopLevelNames(modules) {
  const seen = new Map();
  const problems = [];
  const declRe = /^(?:async\s+)?(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/;

  for (const mod of modules) {
    for (const line of mod.code.split('\n')) {
      const match = line.match(declRe);
      if (!match) continue;
      const name = match[1];
      if (seen.has(name)) {
        problems.push(`${name}: ${relative(ROOT, seen.get(name))} and ${relative(ROOT, mod.file)}`);
      } else {
        seen.set(name, mod.file);
      }
    }
  }

  if (problems.length) {
    throw new Error(`Duplicate top-level names would collide when flattened:\n  ${problems.join('\n  ')}`);
  }
  return seen.size;
}

/* ----------------------------------------------------------------- build */

function inlineStyles(html) {
  return html.replace(/<link rel="stylesheet" href="\.\/([^"]+)"\s*\/?>/g, (_match, href) => {
    const css = readFileSync(join(ROOT, href), 'utf8');
    // Returned from a function, so `$&` / `` $` `` inside the CSS stay literal.
    return `<style data-source="${href}">\n${css}\n</style>`;
  });
}

function build() {
  const modules = collectModules(ENTRY);
  const declCount = assertNoDuplicateTopLevelNames(modules);

  const bundle = [
    '(function () {',
    "'use strict';",
    ...modules.map(
      (mod) => `\n/* ===== ${relative(ROOT, mod.file)} ===== */\n${mod.code}`
    ),
    '})();',
  ].join('\n');

  let html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  html = inlineStyles(html);
  // A replacer *function* is essential: the bundle contains `$` + backtick
  // sequences that a string replacement would treat as $-patterns.
  html = html.replace(
    /<script type="module" src="\.\/src\/main\.js"><\/script>/,
    () => `<script>\n${bundle}\n</script>`
  );
  html = html.replace(
    '<head>',
    '<head>\n<!-- Built by build.mjs — single-file offline bundle. Source lives in src/ and styles/. -->'
  );

  // Fail loudly rather than shipping a broken bundle.
  try {
    // eslint-disable-next-line no-new-func
    new Function(bundle);
  } catch (error) {
    throw new Error(`Bundle failed to parse: ${error.message}`);
  }

  const styleCount = (html.match(/<style data-source/g) || []).length;
  const scriptCount = (html.match(/<script>/g) || []).length;
  if (styleCount !== 4 || scriptCount !== 1) {
    throw new Error(`Unexpected output shape: ${styleCount} style blocks, ${scriptCount} inline scripts`);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, html, 'utf8');

  const allFiles = listJsFiles(join(ROOT, 'src'));
  const kb = (Buffer.byteLength(html) / 1024).toFixed(1);
  console.log(`✓ ${relative(ROOT, OUT_FILE)}  (${kb} KB)`);
  console.log(`  ${modules.length} modules bundled, ${declCount} unique top-level declarations`);
  if (allFiles.length !== modules.length) {
    const bundled = new Set(modules.map((m) => m.file));
    const orphans = allFiles.filter((f) => !bundled.has(resolve(f))).map((f) => relative(ROOT, f));
    console.log(`  note: ${orphans.length} file(s) not reachable from the entry point: ${orphans.join(', ')}`);
  }
}

build();
