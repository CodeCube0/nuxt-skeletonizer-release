import { type ComputedRef } from 'vue';
import { type PrimitiveLoadingProps } from './usePrimitive.js';
export type { PrimitiveLoadingProps };
/** Visual treatment an inline primitive resolves to. */
export type SvgVisualMode = 'sweep' | 'pulse' | 'none';
/**
 * A single shape inside an inline primitive's `<svg>`. Horizontal values (`x`,
 * `w`, `cx`, `r`) may be px numbers or percentage strings; vertical values
 * (`y`, `h`, `cy`) are px numbers. This lets composites mix absolute px offsets
 * (so avatars stay perfectly circular) with fluid `%` widths.
 */
export interface SvgShape {
    type: 'rect' | 'circle';
    x?: number | string;
    y?: number;
    w?: number | string;
    h?: number | string;
    rx?: number;
    cx?: number | string;
    cy?: number;
    r?: number | string;
}
export interface UseSvgPrimitiveResult {
    /** Whether the bone(s) should render (vs. the real-content slot). */
    loading: ComputedRef<boolean>;
    /** The resolved visual mode (sweep / pulse / none). */
    mode: ComputedRef<SvgVisualMode>;
    /** SSR-stable, collision-free gradient id (`sk-shimmer-<uid>`). */
    gradId: ComputedRef<string>;
    /** The `fill` value every shape should use. */
    fill: ComputedRef<string>;
    /** SMIL `dur` for the gradient sweep, e.g. `1.2s`. */
    durSec: ComputedRef<string>;
}
/**
 * Shared plumbing for the inline-SVG `Skeleton*` primitives: loading state, a
 * collision-free gradient id, the resolved visual mode and the shimmer fill.
 *
 * Reduced-motion is applied *after mount* (client-only) so the SSR markup and
 * the hydrated markup match — no hydration mismatch — and the animation simply
 * stops on the client for users who asked for it.
 */
export declare function useSvgPrimitive(props: PrimitiveLoadingProps): UseSvgPrimitiveResult;
