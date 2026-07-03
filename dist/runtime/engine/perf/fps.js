import { cancelRaf, now, raf } from "../clock.js";
export class FpsSampler {
  rafId = null;
  last = 0;
  /** Exponential moving average of instantaneous FPS. */
  emaFps = 60;
  /** Exponential moving average of normalized frame overrun in [0,1]. */
  emaPressure = 0;
  running = false;
  /** Smoothing factor for the EMAs (0..1, higher = more reactive). */
  alpha;
  onSample;
  constructor(opts = {}) {
    this.alpha = opts.alpha ?? 0.1;
    this.onSample = opts.onSample;
  }
  /** True while the rAF loop is active. */
  get active() {
    return this.running;
  }
  /** Smoothed frames-per-second. Resets to a neutral 60 between runs. */
  get fps() {
    return Math.round(this.emaFps);
  }
  /** Heuristic CPU pressure in [0,1] (1 = heavily saturated). */
  get cpu() {
    return Math.min(1, Math.max(0, this.emaPressure));
  }
  /** Begin sampling. Idempotent. No-op without `requestAnimationFrame`. */
  start() {
    if (this.running) return;
    if (typeof requestAnimationFrame !== "function") return;
    this.running = true;
    this.last = now();
    this.emaFps = 60;
    this.emaPressure = 0;
    this.tick(this.last);
  }
  /** Stop sampling and tear down the rAF loop (zero steady-state overhead). */
  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelRaf(this.rafId);
      this.rafId = null;
    }
  }
  tick = (t) => {
    if (!this.running) return;
    const delta = t - this.last;
    this.last = t;
    if (delta > 0) {
      const instantFps = 1e3 / delta;
      this.emaFps = this.emaFps + this.alpha * (instantFps - this.emaFps);
      const overrun = Math.min(1, Math.max(0, (delta - 16.67) / 50));
      this.emaPressure = this.emaPressure + this.alpha * (overrun - this.emaPressure);
      this.onSample?.(this.fps, this.cpu);
    }
    this.rafId = raf(this.tick);
  };
}
