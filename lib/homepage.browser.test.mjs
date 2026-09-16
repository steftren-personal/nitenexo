import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.NN_TEST_URL || 'http://127.0.0.1:3100';
const report = process.env.NN_REPORT_DIR || '/tmp/nn2-report';
let browser;
let run = 0;
before(async () => {
  await mkdir(report, { recursive: true });
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
});
after(async () => { await browser?.close(); });

async function open(options = {}, prepare) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
  if (prepare) await prepare(context);
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const external = [];
  await context.route('**/*', route => {
    const url = route.request().url();
    if (!url.startsWith(base) && /^https?:/.test(url)) { external.push(url); return route.abort(); }
    return route.continue();
  });
  await page.coverage.startJSCoverage({ resetOnNavigation: false });
  const close = async () => {
    const coverage = await page.coverage.stopJSCoverage();
    await writeFile(`${report}/browser-coverage-${++run}.json`, JSON.stringify(coverage));
    await context.close();
    assert.deepEqual(errors, [], 'no uncaught browser errors');
    assert.deepEqual(external, [], 'no third-party requests');
  };
  await page.goto(base, { waitUntil: 'networkidle' });
  return { page, context, close };
}

async function playing(page) {
  await page.waitForFunction(() => {
    const v = document.querySelector('.nn-hero video');
    return v && !v.paused && v.currentTime > 0;
  });
}

async function dismiss(page) {
  const decline = page.getByRole('button', { name: 'Ablehnen', exact: true });
  if (await decline.count()) await decline.click();
}

test('portrait hero plays the local loop instead of a static mobile gate', async () => {
  const { page, close } = await open();
  try {
    await page.waitForSelector('.nn-hero video', { state: 'attached' });
    assert.equal(await page.locator('.nn-hero video').count(), 1, 'mobile hero must contain a video');
    await playing(page);
    const video = await page.locator('.nn-hero video').evaluate(v => ({ src: v.currentSrc, muted: v.muted, loop: v.loop, inline: v.playsInline, preload: v.preload }));
    assert.match(video.src, /hero-loop-portrait\.mp4$/);
    assert.equal(video.muted, true); assert.equal(video.loop, true);
    assert.equal(video.inline, true); assert.equal(video.preload, 'metadata');
  } finally { await close(); }
});

test('chapters are content-sized and reduced motion shows every card immediately', async () => {
  const { page, close } = await open({ reducedMotion: 'reduce' });
  try {
    assert.equal(await page.locator('.sb').count(), 6);
    for (const beat of await page.locator('.sb').all()) assert.ok((await beat.boundingBox()).height <= 844 * .7, 'chapters must not create empty viewports');
    assert.equal(await page.locator('.nn-hero video').count(), 0);
    const hidden = await page.locator('[data-reveal]').evaluateAll(elements => elements.filter(el => {
      for (let parent = el; parent; parent = parent.parentElement) if (Number(getComputedStyle(parent).opacity) === 0) return true;
      return false;
    }).length);
    assert.equal(hidden, 0, 'reduced motion must show all cards immediately');
  } finally { await close(); }
});

test('normal chapters no longer pin or stretch over a full viewport', async () => {
  const { page, close } = await open();
  try {
    const heights = await page.locator('.sb').evaluateAll(els => els.map(el => el.getBoundingClientRect().height));
    assert.ok(heights.every(h => h <= 844 * .7), `chapter heights: ${heights}`);
    assert.equal(await page.locator('.tf, .thread-env, .bw-progress, .pin-spacer').count(), 0);
  } finally { await close(); }
});

test('connection updates preserve pause; preference changes unload and restore video', async () => {
  const { page, close } = await open({}, context => context.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', { value: Object.assign(new EventTarget(), { saveData: false, effectiveType: '4g' }) });
  }));
  try {
    await playing(page);
    await page.getByRole('button', { name: 'Hintergrund pausieren' }).click();
    await page.evaluate(() => navigator.connection.dispatchEvent(new Event('change')));
    assert.equal(await page.locator('.nn-hero video').evaluate(v => v.paused), true);
    assert.equal(await page.locator('.nn-hero video').evaluate(v => v.classList.contains('is-playing')), true, 'irrelevant connection changes must keep the paused frame visible');
    await page.evaluate(() => { navigator.connection.saveData = true; navigator.connection.dispatchEvent(new Event('change')); });
    await page.waitForFunction(() => !document.querySelector('.nn-hero video'));
    await page.evaluate(() => { navigator.connection.saveData = false; navigator.connection.dispatchEvent(new Event('change')); });
    await playing(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.querySelector('.nn-hero video'));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await playing(page);
  } finally { await close(); }
});

test('poster completes before video request; reduced motion and Save-Data request no video', async () => {
  for (const mode of ['normal', 'reduce', 'save']) {
    const { page, close } = await open({ reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference' }, mode === 'save' ? context => context.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', { value: Object.assign(new EventTarget(), { saveData: true }) });
    }) : undefined);
    try {
      if (mode === 'normal') await playing(page);
      const entries = await page.evaluate(() => performance.getEntriesByType('resource').map(e => ({ name: e.name, start: e.startTime, end: e.responseEnd })));
      const movies = entries.filter(e => /hero-loop-.*\.mp4/.test(e.name));
      if (mode !== 'normal') assert.equal(movies.length, 0);
      else {
        const poster = entries.find(e => /hero-poster-portrait\.webp/.test(e.name));
        assert.ok(poster && movies.length > 0);
        assert.ok(movies.every(v => v.start >= poster.end), 'video must not compete with the poster');
      }
    } finally { await close(); }
  }
});

test('desktop, tablet, landscape and slow connection select the appropriate local source', async () => {
  for (const sample of [
    { width: 1440, height: 1000, file: '1080', type: '4g' },
    { width: 1024, height: 768, file: '540', type: '4g' },
    { width: 844, height: 390, file: '540', type: '4g' },
    { width: 1440, height: 1000, file: '540', type: '3g' },
  ]) {
    const { page, close } = await open({ viewport: sample }, context => context.addInitScript(type => {
      Object.defineProperty(navigator, 'connection', { value: Object.assign(new EventTarget(), { saveData: false, effectiveType: type }) });
    }, sample.type));
    try { await playing(page); assert.ok((await page.locator('.nn-hero video').evaluate(v => v.currentSrc)).endsWith(`hero-loop-${sample.file}.mp4`)); }
    finally { await close(); }
  }
});

test('video failures and autoplay denial leave the poster and working content', async () => {
  for (const mode of ['error', 'denied']) {
    const { page, close } = await open({}, mode === 'denied' ? context => context.addInitScript(() => {
      HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Playback denied', 'NotAllowedError'));
    }) : undefined);
    try {
      if (mode === 'error') {
        await playing(page);
        // A real decode failure carries a MediaError on the element; a skipped <source> does not.
        await page.locator('video').evaluate(v => { Object.defineProperty(v, 'error', { value: { code: 3, message: 'simulated decode error' } }); v.dispatchEvent(new Event('error')); });
        await page.waitForFunction(() => !document.querySelector('.nn-hero video'));
      }
      assert.ok(await page.locator('.nn-hero-poster img').evaluate(img => img.complete && img.naturalWidth > 0));
      assert.equal(await page.locator('.nn-hero-actions a').count(), 2);
      assert.equal(await page.locator('#hero-title').innerText(), 'Websites, die um 23:40 verkaufen.\nKI, die mitarbeitet.');
    } finally { await close(); }
  }
});

test('tabs have keyboard navigation and accordion keeps single-open behavior', async () => {
  const { page, close } = await open();
  try {
    await dismiss(page);
    assert.equal(await page.getByRole('tab').count(), 4, 'four accessible tabs');
    await page.getByRole('tab', { name: 'Restaurants' }).focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.getByRole('tab', { name: 'Bars' }).getAttribute('aria-selected'), 'true');
    assert.match(await page.getByRole('tabpanel').innerText(), /Mehr los/);
    await page.keyboard.press('End');
    assert.equal(await page.getByRole('tab', { name: 'Cafés' }).getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Home');
    assert.equal(await page.getByRole('tab', { name: 'Restaurants' }).getAttribute('aria-selected'), 'true');
    const buttons = page.locator('#warum button');
    for (const button of await buttons.all()) {
      await button.click();
      assert.ok(await page.locator('#warum button[aria-expanded="true"]').count() <= 1);
    }
  } finally { await close(); }
});

test('compact cookie sheet leaves both hero actions and chips unobscured', async () => {
  const { page, close } = await open();
  try {
    const sheet = page.getByRole('dialog', { name: 'Cookie-Hinweis' });
    await sheet.waitFor();
    const rect = await sheet.boundingBox();
    assert.ok(rect.height <= 132, `sheet height ${rect.height}`);
    const chips = await page.locator('.nn-hero-chips').boundingBox();
    assert.ok(chips.y + chips.height <= rect.y, 'hero chips must sit above the cookie sheet');
    await page.getByRole('button', { name: 'Ablehnen', exact: true }).click();
    assert.equal(await page.evaluate(() => localStorage.getItem('nitenexo-cookie-consent')), 'rejected');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await sheet.count(), 0);
  } finally { await close(); }
});
