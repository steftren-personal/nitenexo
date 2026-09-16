// Guards the scroll → film-time map of »Eine Nacht, ein Take« (ThreadFilm).
// Runs on Node's built-in test runner (no extra dependency):
//   npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildKeyframes, timeAt, sceneAt, type SceneMap } from "./film-timeline.ts";

const map = JSON.parse(readFileSync(new URL("../public/assets/film/scene-map.json", import.meta.url), "utf8")) as SceneMap;

// A 1440x900 page: 800vh hero (sticky range 700vh), six StoryBeats below,
// each entering over one viewport height, chapters of varying length.
const vh = 900;
const heroRange = 7 * vh;
const beatTops = [8 * vh, 13 * vh, 17 * vh, 21.5 * vh, 26 * vh, 33 * vh];
const layout = {
  heroRange,
  pageMax: 36 * vh,
  beats: beatTops.map((top) => ({ start: top - vh, end: top - 0.2 * vh })),
};
const frames = buildKeyframes(map, layout);
const t = (y: number) => timeAt(frames, y);
const near = (a: number, b: number, msg: string) => assert.ok(Math.abs(a - b) < 0.002, `${msg}: ${a} vs ${b}`);

test("scene map has six scenes in page order with 0.6 s crossfades", () => {
  assert.equal(map.scenes.length, 6);
  assert.deepEqual(
    map.scenes.map((s) => s.scene),
    ["01_hero", "05_morgen", "06_faden", "04_club", "03_website", "02_tresen"]
  );
  assert.equal(map.crossfade, 0.6);
  for (let i = 1; i < map.scenes.length; i++) {
    near(map.scenes[i].stable_from - map.scenes[i - 1].stable_to, map.crossfade, `xfade ${i}`);
  }
  near(map.scenes[5].end, map.total, "last scene ends at total");
});

test("hero region scrubs scene 1 from its first to its last stable frame", () => {
  near(t(0), map.scenes[0].stable_from, "top of page");
  near(t(heroRange / 2), map.scenes[0].stable_to / 2, "mid hero");
  near(t(heroRange), map.scenes[0].stable_to, "end of hero");
  assert.equal(sceneAt(map, t(heroRange / 2)), "01_hero");
});

test("a StoryBeat entering the viewport scrubs the crossfade into its scene", () => {
  const b = layout.beats[0];
  near(t(b.start), map.scenes[0].stable_to, "beat start = previous stable_to");
  near(t((b.start + b.end) / 2), (map.scenes[0].stable_to + map.scenes[1].stable_from) / 2, "mid crossfade");
  near(t(b.end), map.scenes[1].stable_from, "beat settled = own stable_from");
});

test("each chapter plays its scene's stable range until the next beat starts", () => {
  for (let i = 1; i <= 5; i++) {
    const own = layout.beats[i - 1];
    const next = layout.beats[i];
    const s = map.scenes[i];
    near(t(own.end), s.stable_from, `${s.scene} start`);
    near(t(next.start), s.stable_to, `${s.scene} end`);
    const mid = (own.end + next.start) / 2;
    near(t(mid), (s.stable_from + s.stable_to) / 2, `${s.scene} mid`);
    assert.equal(sceneAt(map, t(mid)), s.scene, `${s.scene} bound to chapter ${i}`);
  }
});

test("chapters 5 and 6 share the last scene; the page end is the film end", () => {
  const cta = layout.beats[5];
  const last = map.scenes[5];
  assert.equal(sceneAt(map, t(cta.start)), last.scene);
  assert.equal(sceneAt(map, t(cta.end)), last.scene);
  assert.ok(t(cta.end) < last.stable_to, "the CTA does not jump to the tail");
  near(t(layout.pageMax), map.total, "page end");
  near(t(layout.pageMax + 5000), map.total, "overscroll clamps");
});

test("time never runs backwards while scrolling down and stays inside the film", () => {
  let prev = -1;
  for (let y = -100; y <= layout.pageMax + 100; y += 37) {
    const v = t(y);
    assert.ok(v >= prev, `monotone at ${y}: ${v} < ${prev}`);
    assert.ok(v >= 0 && v <= map.total, `in range at ${y}`);
    prev = v;
  }
});

test("without beats (or with overlapping ones) the map degrades to a linear tail", () => {
  const bare = buildKeyframes(map, { heroRange, pageMax: 20 * vh, beats: [] });
  near(timeAt(bare, heroRange), map.scenes[0].stable_to, "hero end");
  near(timeAt(bare, 20 * vh), map.total, "page end");
  near(timeAt(bare, (heroRange + 20 * vh) / 2), (map.scenes[0].stable_to + map.total) / 2, "linear tail");

  // beats measured out of order (e.g. mid-refresh) must not yield a decreasing y axis
  const messy = buildKeyframes(map, {
    heroRange,
    pageMax: 12 * vh,
    beats: [{ start: 9 * vh, end: 9.8 * vh }, { start: 8 * vh, end: 8.8 * vh }],
  });
  for (let i = 1; i < messy.length; i++) {
    assert.ok(messy[i].y >= messy[i - 1].y, `y monotone at ${i}`);
    assert.ok(messy[i].t >= messy[i - 1].t, `t monotone at ${i}`);
  }
});

test("sceneAt names the scene whose frames are on screen, crossfades belong to the incoming scene", () => {
  assert.equal(sceneAt(map, 0), "01_hero");
  assert.equal(sceneAt(map, 4.6), "05_morgen");
  assert.equal(sceneAt(map, 26.9), "02_tresen");
  assert.equal(sceneAt(map, 99), "02_tresen");
});
