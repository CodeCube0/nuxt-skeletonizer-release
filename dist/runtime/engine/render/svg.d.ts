import type { ScannedNode, SkeletonRect, SvgBlueprint, SvgRendererOptions } from '../../../types.js';
/** The visual treatment a render resolves to. */
export type SvgVisualMode = 'sweep' | 'pulse' | 'none';
/** The namespaced gradient id for an instance, e.g. `sk-shimmer-a1`. */
export declare function gradientId(uid: string, index?: number): string;
/**
 * Fold the resolved animation preset + shimmer flag into a concrete visual:
 * sweep-style presets animate the gradient, `pulse`/`fade` breathe the opacity,
 * everything else (or shimmer off) is a static fill.
 */
export declare function visualMode(opts: SvgRendererOptions): SvgVisualMode;
/** Round a coordinate to `precision` decimal places (kills sub-pixel noise). */
export declare function round(value: number, precision: number): number;
/** The shape (rect/circle) for one scanned node. */
export declare function shapeFor(node: ScannedNode, fill: string, precision: number): string;
/**
 * Build the `<svg>` overlay blueprint for a set of scanned nodes.
 *
 * The `<svg>` viewBox is clamped to the exact host bounding box (CLS Guard) so
 * the overlay can never overflow by a pixel, and `preserveAspectRatio="none"`
 * keeps every rect pinned to its measured position at any scale.
 */
export declare function buildBlueprint(nodes: ScannedNode[], container: SkeletonRect, opts: SvgRendererOptions): SvgBlueprint;
