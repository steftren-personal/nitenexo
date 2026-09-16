import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.NN_TEST_URL || 'http://127.0.0.1:3100';
let browser;
before(async () => { browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] }); });
after(async () => { await browser?.close(); });

async function open(options = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  return { page, context };
}

test('portrait hero plays the local loop instead of a static mobile gate', async () => {
  const { page, context } = await open();
  try {
    assert.equal(await page.locator('.nn-hero video').count(), 1, 'mobile hero must contain a video');
    await page.waitForFunction(() => {
      const video = document.querySelector('.nn-hero video');
      return video && !video.paused && video.currentTime > 0;
    });
    const video = await page.locator('.nn-hero video').evaluate(v => ({
      src: v.currentSrc, muted: v.muted, loop: v.loop, inline: v.playsInline, preload: v.preload,
    }));
    assert.match(video.src, /hero-loop-portrait\.mp4$/);
    assert.equal(video.muted, true);
    assert.equal(video.loop, true);
    assert.equal(video.inline, true);
    assert.equal(video.preload, 'metadata');
  } finally { await context.close(); }
});
