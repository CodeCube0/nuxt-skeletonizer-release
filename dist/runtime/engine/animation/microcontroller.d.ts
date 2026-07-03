import type { SkeletonAnimationTier, SkeletonRuntimeSignals } from '../../../types.js';
export interface MicrocontrollerOptions {
    minFps: number;
    /** FPS recovery must exceed `minFps * (1 + margin)` to step back up. */
    hysteresis?: number;
    /** Minimum ms a tier must hold before another change is allowed. */
    dwellMs?: number;
    /** CPU pressure above which the tier is forced down. */
    cpuCeiling?: number;
}
export declare class AnimationMicrocontroller {
    private idx;
    private lastChangeAt;
    private readonly minFps;
    private readonly hysteresis;
    private readonly dwellMs;
    private readonly cpuCeiling;
    constructor(opts: MicrocontrollerOptions);
    /** The current tier. */
    get tier(): SkeletonAnimationTier;
    /** Force a specific tier (e.g. from a policy patch). Resets dwell. */
    force(tier: SkeletonAnimationTier, at: number): void;
    /**
     * Feed live signals and return the (possibly changed) tier. `at` is a caller
     * supplied monotonic timestamp (ms) to keep this pure/SSR-safe.
     */
    update(signals: SkeletonRuntimeSignals, at: number): SkeletonAnimationTier;
}
/** Map a tier to the animation preset name used by the CSS layer. */
export declare function tierToAnimation(tier: SkeletonAnimationTier, base: string): string;
