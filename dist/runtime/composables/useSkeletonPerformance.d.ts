import { type ComputedRef } from 'vue';
import type { SkeletonExplainEntry, SkeletonizerStats, SvgBlueprint } from '../../types.js';
import type { HostCost } from '../engine/devtools/bottleneck.js';
import type { SkeletonEngine } from '../engine/pipeline/index.js';
import type { TelemetryAggregate } from '../engine/telemetry/telemetry.js';
/**
 * The advanced performance / DevTools surface.
 *
 * Exposes the live telemetry, Explain Mode log, bottleneck ranking and the most
 * recently generated SVG blueprint (the "Blueprint Inspector"). Designed to back
 * a Nuxt DevTools panel or an in-app diagnostics dashboard. There are no render
 * strategy or policy controls — SVG is the only backend.
 */
export interface UseSkeletonPerformanceReturn {
    /** Reactive aggregate stats (renderMode, score, fps, tier, cache, timings). */
    stats: SkeletonizerStats;
    /** The underlying engine (for power users). */
    engine: SkeletonEngine;
    /** Snapshot of the telemetry aggregate. */
    telemetry: () => TelemetryAggregate;
    /** A live metric series for sparklines. */
    series: (metric: 'fps' | 'memoryMB' | 'cpu' | 'boneCount', n?: number) => number[];
    /** Natural-language explanations of recent engine decisions (Explain Mode). */
    explanations: () => readonly SkeletonExplainEntry[];
    /** The most recent explanation, if any. */
    lastExplanation: ComputedRef<SkeletonExplainEntry | null>;
    /** Hosts ranked by skeletonization cost (slowest first). */
    bottlenecks: () => HostCost[];
    /** Cache hit/miss ratio in [0,1]. */
    cacheHitRatio: ComputedRef<number>;
    /** The most recently generated SVG blueprint (Blueprint Inspector). */
    blueprint: () => SvgBlueprint | null;
}
export declare function useSkeletonPerformance(): UseSkeletonPerformanceReturn;
