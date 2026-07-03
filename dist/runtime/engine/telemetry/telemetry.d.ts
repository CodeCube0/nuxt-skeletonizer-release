import type { SkeletonStageTimings } from '../../../types.js';
/**
 * Telemetry & Runtime Intelligence (Step 3 §6).
 *
 * A lightweight, allocation-frugal collector for the core engine metrics:
 * per-stage timings, FPS, memory footprint, cache hit/miss ratio and node
 * counts. It keeps a small ring buffer of recent samples (for sparklines /
 * DevTools) and exposes a feedback hook the Adaptive Engine subscribes to so
 * the telemetry → policy → render loop is closed.
 */
export interface TelemetrySample {
    at: number;
    timings: SkeletonStageTimings;
    fps: number;
    cpu: number;
    memoryMB: number;
    boneCount: number;
    strategy: string;
}
export interface TelemetryAggregate {
    /** Samples recorded since load. */
    count: number;
    /** Mean total pipeline time (ms). */
    avgTotalMs: number;
    /** Mean scan time (ms). */
    avgScanMs: number;
    /** Mean render time (ms). */
    avgRenderMs: number;
    /** Cache hit ratio in [0,1]. */
    cacheHitRatio: number;
    /** Worst (max) total time observed (ms). */
    maxTotalMs: number;
}
export declare class TelemetryCollector {
    private capacity;
    private buffer;
    private cacheHits;
    private cacheMisses;
    private subscribers;
    constructor(capacity?: number);
    /** Record a pipeline sample (ring-buffered) and notify subscribers. */
    record(sample: TelemetrySample): void;
    /** Note a cache hit/miss for the running ratio. */
    noteCache(hit: boolean): void;
    /** Subscribe to live samples (feedback loop into the adaptive engine). */
    subscribe(fn: (s: TelemetrySample) => void): () => void;
    /** Most recent N samples (oldest → newest). */
    recent(n?: number): TelemetrySample[];
    /** A specific metric series for sparklines. */
    series(metric: 'fps' | 'memoryMB' | 'cpu' | 'boneCount', n?: number): number[];
    /** Aggregate statistics across the buffer. */
    aggregate(): TelemetryAggregate;
    get cacheStats(): {
        hits: number;
        misses: number;
    };
    reset(): void;
}
