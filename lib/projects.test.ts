// Guards the project data that feeds the "Umgesetzt für" section and /projekte.
// Runs on Node's built-in test runner (no extra dependency):
//   npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { PROJECTS, getProject, type Project } from "./projects.ts";

const FORBIDDEN_WORDS = [
  "Game-Changer",
  "revolutionär",
  "nahtlos",
  "ganzheitlich",
  "Wir freuen uns",
  "API",
  "LLM",
];

test("exactly three projects, each with a unique slug", () => {
  assert.equal(PROJECTS.length, 3);
  const slugs = new Set(PROJECTS.map((p) => p.slug));
  assert.equal(slugs.size, 3);
});

test("every project has avatar, category, one result sentence, three fact chips and a link", () => {
  for (const p of PROJECTS) {
    assert.ok(p.name.length > 0, `${p.slug}: name`);
    assert.ok(["website", "ki"].includes(p.category), `${p.slug}: category`);
    assert.ok(p.avatar.startsWith("/projekte/") || p.avatar === "mascot", `${p.slug}: avatar`);
    assert.ok(p.result.length > 0 && p.result.length <= 160, `${p.slug}: result is one short sentence`);
    assert.equal(p.chips.length, 3, `${p.slug}: three chips`);
    assert.ok(p.facts.length >= 4, `${p.slug}: long-form facts`);
    assert.ok(p.link.href.length > 0 && p.link.label.length > 0, `${p.slug}: link`);
  }
});

test("only Teen Clubbing has real screenshots; the other two use a mock visual", () => {
  const teen = getProject("teen-clubbing-wien");
  assert.ok(teen);
  assert.equal(teen.visual.kind, "screenshots");
  if (teen.visual.kind === "screenshots") {
    assert.match(teen.visual.desktop, /^\/projekte\/.+\.webp$/);
    assert.match(teen.visual.mobile, /^\/projekte\/.+\.webp$/);
  }
  assert.equal(getProject("sorry-not-sorry-event")?.visual.kind, "chat");
  assert.equal(getProject("nitenexo")?.visual.kind, "agents");
});

test("external links open in a new tab, internal ones don't", () => {
  for (const p of PROJECTS) {
    const external = p.link.href.startsWith("http");
    assert.equal(p.link.external, external, `${p.slug}: external flag matches href`);
  }
});

test("copy stays in brand voice: no em-dashes, no banned words, no person names for Sorry Not Sorry", () => {
  const allText = (p: Project) => [p.name, p.result, ...p.chips, ...p.facts, p.intro].join(" ");
  for (const p of PROJECTS) {
    const text = allText(p);
    assert.ok(!text.includes("—"), `${p.slug}: em-dash in copy`);
    for (const w of FORBIDDEN_WORDS) assert.ok(!text.includes(w), `${p.slug}: banned word "${w}"`);
  }
  const sns = getProject("sorry-not-sorry-event");
  assert.ok(sns);
  assert.doesNotMatch(allText(sns), /\b(Herr|Frau)\b/);
});

test("getProject returns undefined for unknown slugs", () => {
  assert.equal(getProject("nope"), undefined);
});
