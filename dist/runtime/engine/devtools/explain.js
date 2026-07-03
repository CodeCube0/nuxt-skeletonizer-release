export class ExplainLog {
  constructor(capacity = 100, enabled = false) {
    this.capacity = capacity;
    this.enabled = enabled;
  }
  entries = [];
  seq = 0;
  subscribers = /* @__PURE__ */ new Set();
  setEnabled(on) {
    this.enabled = on;
  }
  get isEnabled() {
    return this.enabled;
  }
  /** Append an explanation. No-op while disabled (zero overhead). */
  push(code, message, at) {
    if (!this.enabled) return null;
    const entry = { seq: ++this.seq, code, message, at };
    this.entries.push(entry);
    if (this.entries.length > this.capacity) this.entries.shift();
    for (const fn of this.subscribers) fn(entry);
    return entry;
  }
  /** Most recent entries (oldest → newest). */
  list() {
    return this.entries;
  }
  /** The single most recent entry, if any. */
  latest() {
    return this.entries[this.entries.length - 1] ?? null;
  }
  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }
  clear() {
    this.entries = [];
  }
}
export function explainDecision(code, detail) {
  const parts = Object.entries(detail).map(([k, v]) => `${k}=${v}`);
  switch (code) {
    case "cache:hit":
      return `Blueprint SVG servito dalla cache \u2014 scansione saltata (${parts.join(", ")}).`;
    case "degrade:animation": {
      const tier = String(detail.tier ?? "");
      if (tier === "reduced") {
        return `Gradiente degradato a pulse: FPS sceso a ${detail.fps ?? "?"}.`;
      }
      if (tier === "static") {
        return `Animazione disattivata (fill statico): FPS sceso a ${detail.fps ?? "?"}.`;
      }
      return `Animazione degradata: ${parts.join(", ")}.`;
    }
    case "disable:shimmer":
      return `Shimmer disattivato per stress hardware: ${parts.join(", ")}.`;
    default:
      return `${code}: ${parts.join(", ")}`;
  }
}
