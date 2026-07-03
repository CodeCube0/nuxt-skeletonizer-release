const LADDER = ["full", "reduced", "static"];
export class AnimationMicrocontroller {
  idx = 0;
  // Negative infinity so the very first update is never blocked by dwell time.
  lastChangeAt = Number.NEGATIVE_INFINITY;
  minFps;
  hysteresis;
  dwellMs;
  cpuCeiling;
  constructor(opts) {
    this.minFps = opts.minFps;
    this.hysteresis = opts.hysteresis ?? 0.25;
    this.dwellMs = opts.dwellMs ?? 600;
    this.cpuCeiling = opts.cpuCeiling ?? 0.8;
  }
  /** The current tier. */
  get tier() {
    return LADDER[this.idx];
  }
  /** Force a specific tier (e.g. from a policy patch). Resets dwell. */
  force(tier, at) {
    const next = LADDER.indexOf(tier);
    if (next >= 0 && next !== this.idx) {
      this.idx = next;
      this.lastChangeAt = at;
    }
  }
  /**
   * Feed live signals and return the (possibly changed) tier. `at` is a caller
   * supplied monotonic timestamp (ms) to keep this pure/SSR-safe.
   */
  update(signals, at) {
    if (signals.reducedMotion) {
      this.idx = LADDER.length - 1;
      return this.tier;
    }
    if (at - this.lastChangeAt < this.dwellMs) return this.tier;
    const unhealthy = signals.fps > 0 && signals.fps < this.minFps || signals.cpu >= this.cpuCeiling;
    const healthy = signals.fps === 0 || signals.fps > this.minFps * (1 + this.hysteresis) && signals.cpu < this.cpuCeiling * 0.7;
    if (unhealthy && this.idx < LADDER.length - 1) {
      this.idx++;
      this.lastChangeAt = at;
    } else if (healthy && this.idx > 0) {
      this.idx--;
      this.lastChangeAt = at;
    }
    return this.tier;
  }
}
export function tierToAnimation(tier, base) {
  switch (tier) {
    case "static":
      return "none";
    case "reduced":
      return "pulse";
    case "full":
      return base;
  }
}
