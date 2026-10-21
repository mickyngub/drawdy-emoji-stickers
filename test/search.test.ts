import assert from "node:assert/strict";
import { test } from "node:test";
import { ICONS, type CatalogIcon } from "../src/catalog";
import { rank, searchEntry, searchTerms } from "../src/search";

const icon = (name: string, title: string, keywords = ""): CatalogIcon => ({
    name,
    title,
    keywords,
});

const POOL = [
    icon("party-popper", "Party popper", "celebration party tada activities"),
    icon("partying-face", "Partying face", "birthday celebrate party smileys"),
    icon("balloon", "Balloon", "birthday celebrate party activities"),
    icon("red-heart", "Red heart", "love symbols"),
].map(searchEntry);

const names = (query: string) =>
    rank(POOL, searchTerms(query)).map((entry) => entry.icon.name);

test("names that start with the term rank before keyword matches", () => {
    assert.deepEqual(names("party"), [
        "party-popper",
        "partying-face",
        "balloon",
    ]);
});

test("every term must match, in any order", () => {
    assert.deepEqual(names("birthday face"), ["partying-face"]);
    assert.deepEqual(names("love party"), []);
});

test("searching the real catalog by meaning finds the emoji", () => {
    const all = ICONS.map(searchEntry);
    const top = (query: string) =>
        rank(all, searchTerms(query))
            .slice(0, 5)
            .map((entry) => entry.icon.name);
    assert.ok(top("lol").includes("face-with-tears-of-joy"), top("lol").join());
    assert.ok(top("thumbs up").includes("thumbs-up"), top("thumbs up").join());
    assert.equal(top("rocket")[0], "rocket");
});
