import assert from "node:assert/strict";
import { test } from "node:test";
import type { CatalogIcon } from "../src/catalog";
import { TONES, tonedName } from "../src/tones";

const hand: CatalogIcon = {
    name: "waving-hand",
    title: "Waving hand",
    keywords: "",
    tones: true,
};
const face: CatalogIcon = {
    name: "grinning-face",
    title: "Grinning face",
    keywords: "",
};

test("an emoji with skin tones takes the chosen tone as a name suffix", () => {
    assert.equal(tonedName(hand, "medium-dark"), "waving-hand-medium-dark");
    assert.equal(tonedName(hand, "light"), "waving-hand-light");
});

test("the default tone and emoji without tones keep their own name", () => {
    assert.equal(tonedName(hand, "default"), "waving-hand");
    for (const tone of TONES)
        assert.equal(tonedName(face, tone), "grinning-face");
});
