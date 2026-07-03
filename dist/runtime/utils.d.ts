import { type SkeletonizerStore } from './state.js';
/**
 * Resolve a CSS size from a number (→ `px`) or pass a string through verbatim.
 * Returns `undefined` for nullish input so it can be spread into a style object.
 */
export declare function cssSize(value?: string | number | null): string | undefined;
/**
 * Resolve a CSS size to an approximate pixel value, for SVG geometry that needs
 * a concrete number (e.g. vertical metrics). Percentages and unknown units fall
 * back to `fallback`. `rem`/`em` are approximated at 16px.
 */
export declare function pxSize(value: string | number | undefined | null, fallback?: number): number;
/**
 * Resolve a width expressed as a percentage (`'60%'`) or a 0–100 number into a
 * percentage string for an SVG horizontal coordinate. Pixel/`rem` widths are
 * passed through verbatim (SVG accepts px lengths on rect width).
 */
export declare function svgWidthValue(value: string | number | undefined | null, fallback?: string): string;
/**
 * Get the skeletonizer store from injection (request-safe) with a module-level
 * fallback. Returns `null` when used entirely outside a Nuxt/plugin context;
 * components degrade to sensible literal defaults in that case.
 */
export declare function useSkeletonStore(): SkeletonizerStore | null;
