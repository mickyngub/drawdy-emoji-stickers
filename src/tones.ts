import type { CatalogIcon } from "./catalog";
import type { Tone } from "./shared/messages";

export const TONES: readonly Tone[] = [
    "default",
    "light",
    "medium-light",
    "medium",
    "medium-dark",
    "dark",
];

// Fluent names a skin-tone variant by suffixing the base emoji's name.
export function tonedName(icon: CatalogIcon, tone: Tone): string {
    return icon.tones && tone !== "default"
        ? `${icon.name}-${tone}`
        : icon.name;
}
