// Scroll → film-time map for »Eine Nacht, ein Take« (ThreadFilm).
//
// The film is one 27 s take cut from six scenes with 0.6 s crossfades
// (public/assets/film/scene-map.json). The hero region scrubs scene 1's
// stable frames; every StoryBeat below binds the next scene: while the beat
// scrolls into the viewport the crossfade plays, then the scene's stable range
// is spread across the chapter until the next beat starts entering. Extra
// beats (chapter 6) stay inside the last scene; the page end is the film end.
//
// Pure functions, no DOM: ThreadFilm measures the layout, this file maps it.

export type Scene = {
  scene: string;
  page: string;
  start: number;
  end: number;
  stable_from: number;
  stable_to: number;
};

export type SceneMap = {
  fps: number;
  crossfade: number;
  total: number;
  scenes: Scene[];
};

/** Scroll positions (px) of one chapter beat: `start` when it begins entering
 *  the viewport, `end` when it is settled on screen. */
export type BeatRange = { start: number; end: number };

export type Layout = {
  /** scrollY at which the sticky hero stage unpins (hero height minus viewport). */
  heroRange: number;
  /** maximum scrollY of the page. */
  pageMax: number;
  /** the StoryBeats in page order. */
  beats: BeatRange[];
};

/** One point of the piecewise-linear map: scrollY `y` → film time `t`. */
export type Keyframe = { y: number; t: number };

export function buildKeyframes(map: SceneMap, layout: Layout): Keyframe[] {
  const scenes = map.scenes;
  if (scenes.length === 0) return [{ y: 0, t: 0 }];

  const frames: Keyframe[] = [];
  // every keyframe keeps both axes monotone, whatever the layout measured
  const push = (y: number, t: number) => {
    const prev = frames[frames.length - 1];
    frames.push({
      y: prev ? Math.max(prev.y, y) : y,
      t: prev ? Math.max(prev.t, t) : t,
    });
  };

  // hero region: scene 1, first to last stable frame
  push(0, scenes[0].stable_from);
  push(Math.max(0, layout.heroRange), scenes[0].stable_to);

  // one scene per beat: crossfade while the beat enters, then the stable range
  const bound = Math.min(layout.beats.length, scenes.length - 1);
  for (let i = 0; i < bound; i++) {
    const beat = layout.beats[i];
    const prev = scenes[i];
    const own = scenes[i + 1];
    push(beat.start, prev.stable_to);
    push(beat.end, own.stable_from);
  }

  // the last bound scene (or the whole remaining film, if beats are missing)
  // runs to the film's end at the bottom of the page
  push(Math.max(layout.pageMax, frames[frames.length - 1].y), map.total);
  return frames;
}

/** Film time for a scroll position: linear inside each segment, clamped outside. */
export function timeAt(frames: Keyframe[], y: number): number {
  if (frames.length === 0) return 0;
  if (y <= frames[0].y) return frames[0].t;
  const last = frames[frames.length - 1];
  if (y >= last.y) return last.t;
  for (let i = 1; i < frames.length; i++) {
    const a = frames[i - 1];
    const b = frames[i];
    if (y <= b.y) {
      const span = b.y - a.y;
      if (span <= 0) return b.t;
      return a.t + ((y - a.y) / span) * (b.t - a.t);
    }
  }
  return last.t;
}

/** Name of the scene on screen at film time `t`; a crossfade counts for the
 *  incoming scene (its frames are what the visitor reads). */
export function sceneAt(map: SceneMap, t: number): string {
  const scenes = map.scenes;
  if (scenes.length === 0) return "";
  for (let i = scenes.length - 1; i >= 0; i--) {
    if (t >= scenes[i].start) return scenes[i].scene;
  }
  return scenes[0].scene;
}
