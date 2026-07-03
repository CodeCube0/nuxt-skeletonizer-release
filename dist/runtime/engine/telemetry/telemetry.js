export class TelemetryCollector {
  constructor(capacity = 120) {
    this.capacity = capacity;
  }
  buffer = [];
  cacheHits = 0;
  cacheMisses = 0;
  subscribers = /* @__PURE__ */ new Set();
  /** Record a pipeline sample (ring-buffered) and notify subscribers. */
  record(sample) {
    this.buffer.push(sample);
    if (this.buffer.length > this.capacity) this.buffer.shift();
    for (const fn of this.subscribers) fn(sample);
  }
  /** Note a cache hit/miss for the running ratio. */
  noteCache(hit) {
    if (hit) this.cacheHits++;
    else this.cacheMisses++;
  }
  /** Subscribe to live samples (feedback loop into the adaptive engine). */
  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }
  /** Most recent N samples (oldest → newest). */
  recent(n = this.capacity) {
    return this.buffer.slice(-n);
  }
  /** A specific metric series for sparklines. */
  series(metric, n = 60) {
    return this.recent(n).map((s) => {
      if (metric === "fps") return s.fps;
      if (metric === "memoryMB") return s.memoryMB;
      if (metric === "cpu") return s.cpu;
      return s.boneCount;
    });
  }
  /** Aggregate statistics across the buffer. */
  aggregate() {
    const n = this.buffer.length;
    if (n === 0) {
      return { count: 0, avgTotalMs: 0, avgScanMs: 0, avgRenderMs: 0, cacheHitRatio: 0, maxTotalMs: 0 };
    }
    let total = 0;
    let scan = 0;
    let render = 0;
    let maxTotal = 0;
    for (const s of this.buffer) {
      total += s.timings.totalMs;
      scan += s.timings.scanMs;
      render += s.timings.renderMs;
      if (s.timings.totalMs > maxTotal) maxTotal = s.timings.totalMs;
    }
    const cacheTotal = this.cacheHits + this.cacheMisses;
    return {
      count: n,
      avgTotalMs: round2(total / n),
      avgScanMs: round2(scan / n),
      avgRenderMs: round2(render / n),
      cacheHitRatio: cacheTotal === 0 ? 0 : round2(this.cacheHits / cacheTotal),
      maxTotalMs: round2(maxTotal)
    };
  }
  get cacheStats() {
    return { hits: this.cacheHits, misses: this.cacheMisses };
  }
  reset() {
    this.buffer = [];
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}
function round2(n) {
  return Math.round(n * 100) / 100;
}
