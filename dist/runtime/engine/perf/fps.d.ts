/**
 * A frame-rate sampler built on `requestAnimationFrame`.
 *
 * **TAR compliance (Step 3 §1):** the rAF loop is *only* alive between
 * {@link FpsSampler.start} and {@link FpsSampler.stop}. The adaptive controller
 * starts it when loading/transition begins and stops it the instant the real
 * component hydrates, so the steady-state overhead is exactly zero.
 *
 * Besides FPS it derives a cheap CPU-pressure estimate from frame-time jitter:
 * the more frames overrun the 16.7 ms budget, the higher the pressure.
 */
export declare class FpsSampler {
    private rafId;
    private last;
    /** Exponential moving average of instantaneous FPS. */
    private emaFps;
    /** Exponential moving average of normalized frame overrun in [0,1]. */
    private emaPressure;
    private running;
    /** Smoothing factor for the EMAs (0..1, higher = more reactive). */
    private readonly alpha;
    private readonly onSample?;
    constructor(opts?: {
        alpha?: number;
        onSample?: (fps: number, cpu: number) => void;
    });
    /** True while the rAF loop is active. */
    get active(): boolean;
    /** Smoothed frames-per-second. Resets to a neutral 60 between runs. */
    get fps(): number;
    /** Heuristic CPU pressure in [0,1] (1 = heavily saturated). */
    get cpu(): number;
    /** Begin sampling. Idempotent. No-op without `requestAnimationFrame`. */
    start(): void;
    /** Stop sampling and tear down the rAF loop (zero steady-state overhead). */
    stop(): void;
    private tick;
}
