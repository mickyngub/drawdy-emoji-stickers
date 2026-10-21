import assert from "node:assert/strict";
import { test } from "node:test";
// @ts-expect-error the build script is plain JavaScript
import * as builder from "../scripts/build-catalog.mjs";
import { CATEGORIES, ICONS } from "../src/catalog";

const { buildCatalog, readPackages, titleFor, TONES } = builder;

const NAME = /^[a-z0-9-]+$/;
const byName = new Map(ICONS.map((icon) => [icon.name, icon]));
const TONE_SUFFIX = /-(medium-light|medium-dark|light|medium|dark)$/;

test("the committed catalog matches the pinned packages", () => {
    const built = buildCatalog(...readPackages());
    assert.deepEqual(built.icons, ICONS, "run npm run catalog");
    assert.deepEqual(built.categories, CATEGORIES, "run npm run catalog");
});

test("every emoji has a plain name and a title, once", () => {
    const seen = new Set<string>();
    for (const icon of ICONS) {
        assert.match(icon.name, NAME);
        assert.ok(icon.title.length > 0, icon.name);
        assert.ok(!seen.has(icon.name), `${icon.name} is listed twice`);
        seen.add(icon.name);
    }
    assert.ok(ICONS.length > 1500, `only ${ICONS.length} emoji`);
});

test("skin-tone variants never appear as emoji of their own", () => {
    for (const icon of ICONS) {
        const base = icon.name.replace(TONE_SUFFIX, "");
        assert.ok(
            base === icon.name || !byName.has(base),
            `${icon.name} is a variant of ${base}`
        );
    }
    assert.ok(byName.has("horizontal-traffic-light"));
    assert.ok(byName.has("vertical-traffic-light"));
});

test("people and hands with all five variants are marked as having tones", () => {
    assert.equal(byName.get("waving-hand")?.tones, true);
    assert.equal(byName.get("thumbs-up")?.tones, true);
    assert.equal(byName.get("grinning-face")?.tones, undefined);
    assert.equal(byName.get("horizontal-traffic-light")?.tones, undefined);
    assert.equal(TONES.length, 5);
    assert.ok(ICONS.filter((icon) => icon.tones).length > 300);
});

test("Emojibase labels and tags give titles and search words", () => {
    const joy = byName.get("face-with-tears-of-joy");
    assert.equal(joy?.title, "Face with tears of joy");
    assert.ok(joy?.keywords.split(" ").includes("lol"));
    assert.ok(joy?.keywords.split(" ").includes("smileys"));
    assert.equal(titleFor("knocked-out-face"), "Knocked out face");
    assert.equal(byName.get("knocked-out-face")?.title, "Knocked out face");
});

test("groups come in emoji keyboard order, Flags folded into Symbols", () => {
    assert.deepEqual(
        CATEGORIES.map((group) => group.id),
        [
            "smileys",
            "people",
            "animals",
            "food",
            "travel",
            "activities",
            "objects",
            "symbols",
        ]
    );
    const smileys = CATEGORIES[0].names;
    assert.equal(smileys[0], "grinning-face");
    assert.ok(CATEGORIES[7].names.includes("chequered-flag"));
    const listed = new Set(ICONS.map((icon) => icon.name));
    for (const group of CATEGORIES) {
        assert.ok(group.names.length > 0, `${group.title} is empty`);
        for (const name of group.names)
            assert.ok(listed.has(name), `${group.title}: ${name}`);
    }
    assert.equal(
        CATEGORIES.reduce((sum, group) => sum + group.names.length, 0),
        ICONS.length
    );
});
