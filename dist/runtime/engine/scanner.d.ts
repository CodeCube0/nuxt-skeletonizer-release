import type { ScannedNode, SkeletonBoneKind, SkeletonRect } from '../../types.js';
/**
 * Layout metadata for a flex/grid container the scan descended into. Captured
 * for fidelity verification and DevTools/telemetry — the SVG output is already
 * pixel-accurate without it, because every descendant bone is drawn at its own
 * real absolute position (the gap and alignment are implicit in those
 * coordinates). This is the explicit record STEP 6 asks the scan layer to keep.
 */
export interface ScannedContainerLayout {
    /** Bounding box relative to the host origin, in CSS px. */
    rect: SkeletonRect;
    display: 'flex' | 'grid';
    /** `flex-direction` (flex containers only). */
    direction?: string;
    justify: string;
    align: string;
    /** Row/column gap, in CSS px. */
    gap: {
        row: number;
        column: number;
    };
    /** Track count derived from `grid-template-columns`/`-rows` (grid only). */
    columns?: number;
    rows?: number;
}
/**
 * The Scan Layer.
 *
 * Walks a host subtree (iterative DFS, leaf-stop, container descent) and
 * **measures** every element it would skeletonize into a flat list of
 * {@link ScannedNode}s — each carrying a host-relative bounding box, a semantic
 * kind and a border radius. It is fully non-destructive: it only *reads* the
 * DOM (`getBoundingClientRect`, `getComputedStyle`), never moving, wrapping,
 * mutating or removing a node. The SVG renderer turns the result into a single
 * `<svg>` overlay.
 *
 * Directive handling:
 * - `v-skeleton-ignore` / `v-skeleton-keep` → skipped, no rect (content kept).
 * - `v-skeleton-replace` → one rect of the forced kind, leaf-stop.
 * - `v-skeleton-union`   → bounding boxes of elements sharing a group value are
 *   merged into a single rect; a valueless union is a standalone block.
 * - `v-skeleton-shimmer` → a translucent shimmer rect over the element while its
 *   real content stays visible.
 */
export interface ScannerOptions {
    /** Honour each element's own border-radius (vs. the themed default). */
    respectBorderRadius: boolean;
    /** Themed default radius (px) used when `respectBorderRadius` is false. */
    defaultRadius: number;
    /** Maximum DOM depth the scan will descend (guards pathological trees). */
    maxDepth: number;
    /** Emit verbose diagnostics to the console. */
    debug: boolean;
}
export interface ScanOutput {
    /** The measured nodes, in DFS order plus any merged union rects. */
    nodes: ScannedNode[];
    /** Number of elements skipped/ignored during this scan. */
    ignored: number;
    /** Wall-clock duration of the scan, in milliseconds. */
    durationMs: number;
    /** Flex/grid layout metadata for every container descended into. */
    containers: ScannedContainerLayout[];
}
/**
 * Scan a host subtree into a list of measured {@link ScannedNode}s. Pure with
 * respect to the DOM (reads only).
 */
export declare function scanSubtree(root: HTMLElement, opts: ScannerOptions): ScanOutput;
export type { ScannedNode, SkeletonBoneKind };
