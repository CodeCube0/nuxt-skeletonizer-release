import type { SkeletonAnimationTier, SkeletonRuntimeSignals } from '../../../types.js';
/**
 * The Adaptive decision function.
 *
 * Pure and synchronous: given the live signals and the tier proposed by the
 * Animation Microcontroller, it produces the concrete runtime decision —
 * animation tier and whether the shimmer runs — plus a list of explain codes
 * describing *why*. There is no rendering-strategy decision any more: SVG is the
 * only backend. Keeping this pure makes the adaptive behaviour unit-testable
 * without a DOM.
 */
export interface AdaptiveInput {
    signals: SkeletonRuntimeSignals;
    /** Tier proposed by the Animation Microcontroller. */
    microTier: SkeletonAnimationTier;
    config: {
        /** Whether the scope wants the shimmer at all. */
        shimmer: boolean;
        /** Whether the Adaptive Animation System is enabled. */
        adaptive: boolean;
    };
}
export interface AdaptiveDecision {
    animationTier: SkeletonAnimationTier;
    shimmer: boolean;
    /** Explain codes + details, applied in order. */
    reasons: Array<{
        code: string;
        detail: Record<string, string | number>;
    }>;
}
export declare function resolveDecision(input: AdaptiveInput): AdaptiveDecision;
