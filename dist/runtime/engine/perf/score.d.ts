import type { SkeletonRuntimeSignals } from '../../../types.js';
/**
 * The Performance Score Engine (Step 3 §1).
 *
 * Folds the live runtime signals into a single composite health score in
 * `[0,100]` (higher = healthier). The adaptive controller and the Policy
 * Engine use the score and its sub-components to decide when to degrade,
 * cluster, switch backend or disable the shimmer.
 *
 * The weights are deliberately simple and explainable — Explain Mode quotes
 * the dominant penalty when narrating a decision.
 */
export interface PerformanceScore {
    /** Composite score in [0,100]. */
    value: number;
    /** FPS sub-score in [0,100]. */
    fps: number;
    /** CPU headroom sub-score in [0,100]. */
    cpu: number;
    /** Memory headroom sub-score in [0,100]. */
    memory: number;
    /** Structural-complexity sub-score in [0,100]. */
    complexity: number;
    /** The dominant penalty driver, e.g. `'fps'` — used by Explain Mode. */
    bottleneck: 'fps' | 'cpu' | 'memory' | 'complexity' | 'none';
}
export interface ScoreThresholds {
    /** FPS at or below which the fps sub-score hits 0. */
    minFps: number;
    /** Bone count treated as "heavy" (complexity sub-score halves around here). */
    heavyNodes: number;
    /** Heap (MB) treated as the soft ceiling for the memory sub-score. */
    memoryCeilingMB: number;
}
export declare const DEFAULT_THRESHOLDS: ScoreThresholds;
/**
 * Compute the composite performance score from live signals.
 *
 * - FPS:        linear from `minFps` (→0) to 60 (→100).
 * - CPU:        `(1 - cpu) * 100` (pressure inverts to headroom).
 * - Memory:     headroom against the soft ceiling.
 * - Complexity: decays as bone count passes `heavyNodes`.
 */
export declare function computeScore(signals: Pick<SkeletonRuntimeSignals, 'fps' | 'cpu' | 'memoryMB' | 'boneCount'>, thresholds?: ScoreThresholds): PerformanceScore;
/** Read an estimate of the JS heap in MB (Chromium-only; 0 elsewhere). */
export declare function readMemoryMB(): number;
/** Logical CPU cores, or 0 when unknown. */
export declare function readCores(): number;
/** Whether the user prefers reduced motion (SSR-safe). */
export declare function prefersReducedMotion(): boolean;
