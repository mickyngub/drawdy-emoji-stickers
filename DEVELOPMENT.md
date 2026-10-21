# Developing Emoji Stickers

```bash
npm install
npm test
npm run typecheck
npm run check-catalog  # does Iconify still serve every emoji and skin tone in the catalog?
npm run dev            # Tailwind watcher plus the dev server on :5202; in Drawdy run ⌘K → "Add extension dev server" on a local board
npm run build          # regenerates src/catalog-data.ts, src/panel-css.ts, src/webview-html.ts and dist/*.drawdyx
npm run preflight      # before submitting: committed, built, pushed, under Drawdy's limits, above the live version
```

The emoji list, groups and skin tones come from the pinned `@iconify-json/fluent-emoji` and `@iconify-json/fluent-emoji-flat` packages, and the titles, keywords and keyboard order from `emojibase-data`: `scripts/build-catalog.mjs` joins them into `src/catalog-data.ts`, and the palette fetches each SVG from the Iconify API as it scrolls into view. A skin tone is a name suffix (`waving-hand-medium-dark`), so only base emoji are listed and `tones: true` marks those with all five variants. Drawdy builds published versions from this repository's `src/index.ts` and runs no build step, so commit the generated `src/catalog-data.ts`, `src/panel-css.ts` and `src/webview-html.ts` after `npm run build`. The panel is styled with Tailwind CSS v4 utilities: `webview/panel.css` maps Drawdy's theme variables onto Tailwind colours, so the panel follows the board's light and dark themes.

Bump `driverVersion` in `manifest.json` for every release and add it to `CHANGELOG.md`. `npm test` holds the manifest and listing files to Drawdy's submission rules (a description of at most 500 characters, an icon of at most 256 KB, only `@drawdy/driver-protocol` imported from outside the repository), checks that the committed catalog matches the pinned packages, and tests the skin tones, the search ranking, the SVG finishing, the Iconify batching, the click layout and the saved-state checks.
