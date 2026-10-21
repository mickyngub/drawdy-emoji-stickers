export type CatalogIcon = {
    name: string;
    title: string;
    keywords: string;
    tones?: true;
};

export type Category = {
    id: string;
    title: string;
    names: string[];
};

export { CATEGORIES, ICONS } from "./catalog-data";
