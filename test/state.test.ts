import assert from "node:assert/strict";
import { test } from "node:test";
import { readState } from "../src/index";

const DEFAULT_OPTIONS = {
    size: 128,
    style: "shaded",
    tone: "default",
    label: false,
};

test("readState falls back to the defaults: large, shaded, default tone, no label", () => {
    const empty = { recent: [], options: DEFAULT_OPTIONS };
    assert.deepEqual(readState(undefined), empty);
    assert.deepEqual(readState({}), empty);
});

test("readState keeps valid values", () => {
    const options = {
        size: 32,
        style: "flat",
        tone: "medium-dark",
        label: true,
    };
    const recent = [
        {
            prefix: "fluent-emoji-flat",
            name: "waving-hand-medium-dark",
            title: "Waving hand",
        },
        {
            prefix: "fluent-emoji",
            name: "1st-place-medal",
            title: "1st place medal",
        },
    ];
    assert.deepEqual(readState({ recent, options }), { recent, options });
});

test("readState rejects a bad size, style, tone and label", () => {
    const state = readState({
        options: { size: 100, style: "3d", tone: "yellow", label: "true" },
    });
    assert.deepEqual(state.options, DEFAULT_OPTIONS);
});

test("readState drops a colour left over from another palette", () => {
    const state = readState({ options: { color: "#ff4d4d", size: 64 } });
    assert.deepEqual(state.options, { ...DEFAULT_OPTIONS, size: 64 });
    assert.ok(!("color" in state.options));
});

test("readState drops recent emoji from other sets and odd names, and keeps 12", () => {
    const kept = {
        prefix: "fluent-emoji",
        name: "party-popper",
        title: "Party popper",
    };
    const state = readState({
        recent: [
            { prefix: "streamline-freehand", name: "camera", title: "Camera" },
            { prefix: "noto", name: "party-popper", title: "Party popper" },
            { prefix: "fluent-emoji", name: "Party-Popper", title: "x" },
            { prefix: "fluent-emoji", name: "../x", title: "x" },
            { prefix: "fluent-emoji", name: "rocket" },
            kept,
        ],
    });
    assert.deepEqual(state.recent, [kept]);
    const many = Array.from({ length: 20 }, (_, i) => ({
        ...kept,
        name: `party-popper-${i}`,
    }));
    assert.equal(readState({ recent: many }).recent.length, 12);
});
