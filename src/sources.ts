import type { Style } from "./shared/messages";

export const ICONIFY_HOST = "https://api.iconify.design";

export const STYLE_PREFIX: Record<Style, string> = {
    shaded: "fluent-emoji",
    flat: "fluent-emoji-flat",
};

export const PREFIXES = Object.values(STYLE_PREFIX);
