/**
 * Monotonic clock helpers shared across the engine. They degrade gracefully
 * when `performance`/`requestAnimationFrame` are unavailable (SSR, tests).
 */
/** High-resolution monotonic timestamp in ms (0 when `performance` is absent). */
export declare function now(): number;
/** `requestAnimationFrame` with a `setTimeout` fallback. Returns a cancel id. */
export declare function raf(cb: (t: number) => void): number;
/** Cancel an id returned by {@link raf}. */
export declare function cancelRaf(id: number): void;
/** `requestIdleCallback` with a `setTimeout` fallback (TAR: off-main-thread). */
export declare function idle(cb: () => void, timeout?: number): number;
/** Cancel an id returned by {@link idle}. */
export declare function cancelIdle(id: number): void;
