import type { SkeletonRect } from '../../../types.js';
/**
 * CLS Guard — Cumulative Layout Shift prevention.
 *
 * The SVG overlay is injected *over* the host while the real content is hidden
 * but kept in layout (it keeps occupying its box), so the skeleton→content
 * swap shifts nothing. The guard's job is to clamp the overlay's `viewBox` to
 * the exact host bounding box so the SVG can never overflow — or fall short —
 * by even a pixel.
 *
 * It also wraps `PerformanceObserver('layout-shift')` to *measure* the CLS
 * actually accrued during a transition, feeding the telemetry layer so the
 * zero-CLS guarantee is verified, not merely asserted.
 */
/** A `viewBox` clamped to the exact host box, so the overlay never overflows. */
export declare function clampViewBox(rect: SkeletonRect): string;
/**
 * Observe layout shifts for the duration of a transition. Returns a `stop()`
 * that resolves the total CLS score observed. No-ops (resolves 0) where the
 * API is unavailable (SSR, happy-dom, non-Chromium).
 */
export declare function measureCls(): {
    stop: () => number;
};
