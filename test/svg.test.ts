import assert from "node:assert/strict";
import { test } from "node:test";
import { finalizeIconSvg, recolorSvg, type SvgOptions } from "../src/svg";

const TWO_TONE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill="#020202" d="M1 1h2"/><path fill="#0C6FFF" d="M5 5h2"/></g></svg>`;
const WIDE = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 153"><path fill="#f90" d="M0 0h256v153H0z"/></svg>`;
const HOSTILE = `<?xml version="1.0"?><!-- note --><svg viewBox="0 0 24 24" onload="alert(1)"><script>alert(2)</script><path onclick='steal()' d="M0 0h24"/></svg>`;

const OPTIONS: SvgOptions = { size: 64, recolor: {} };

function finish(svg: string, overrides: Partial<SvgOptions> = {}) {
    const result = finalizeIconSvg(svg, { ...OPTIONS, ...overrides });
    assert.ok(result, "finalizeIconSvg returned null");
    return result;
}

const rootTag = (svg: string): string => /^<svg[^>]*>/.exec(svg)?.[0] ?? "";

test("an emoji keeps every colour it was drawn with", () => {
    const emoji = `<svg viewBox="0 0 32 32"><path fill="#FFB02E" d="M1 1h2"/><path fill="url(#a)" d="M2 2h2"/><stop stop-color="#402A32"/></svg>`;
    const { svg } = finish(emoji);
    assert.match(svg, /fill="#FFB02E"/);
    assert.match(svg, /fill="url\(#a\)"/);
    assert.match(svg, /stop-color="#402A32"/);
});

test("the recolour map only swaps the paints it names", () => {
    const svg = recolorSvg(TWO_TONE, { "#020202": "#111111" });
    assert.match(svg, /<g fill="none">/);
    assert.match(svg, /<path fill="#111111" d="M1 1h2"/);
    assert.match(svg, /<path fill="#0C6FFF" d="M5 5h2"/);
});

test("a wide viewBox keeps its aspect on the board and stays crisp", () => {
    const { svg, width, height } = finish(WIDE);
    assert.equal(width, 64);
    assert.equal(height, 38.25);
    assert.match(rootTag(svg), / width="512"/);
    assert.match(rootTag(svg), / height="306"/);
});

test("an icon without a viewBox is treated as 24 by 24", () => {
    const { svg, width, height } = finish(`<svg><path d="M0 0"/></svg>`, {
        size: 128,
    });
    assert.deepEqual([width, height], [128, 128]);
    assert.match(rootTag(svg), / viewBox="0 0 24 24"/);
});

test("scripts, event handlers, comments and the XML declaration are stripped", () => {
    const { svg } = finish(HOSTILE);
    assert.ok(!/script/i.test(svg));
    assert.ok(!/\son[a-z]+\s*=/i.test(svg));
    assert.ok(!svg.includes("<!--"));
    assert.ok(!svg.includes("<?xml"));
    assert.match(svg, /<path\s+d="M0 0h24"\/>/);
});

test("text that is not an SVG is refused", () => {
    assert.equal(finalizeIconSvg("<html></html>", OPTIONS), null);
    assert.equal(finalizeIconSvg("", OPTIONS), null);
});
