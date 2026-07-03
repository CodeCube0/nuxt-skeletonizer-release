export function fnv1a(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}
export function bucket(value, step = 80) {
  return Math.round(value / step) * step;
}
export function layoutFingerprint(route, viewport, uid) {
  const key = fnv1a(`${route}|${bucket(viewport.width)}x${bucket(viewport.height)}|${uid}`);
  return { route, viewport, uid, key };
}
const SS_PREFIX = "sk:bp:";
export class LayoutFingerprintCache {
  constructor(mode = "memory", maxEntries = 64) {
    this.mode = mode;
    this.maxEntries = maxEntries;
  }
  mem = /* @__PURE__ */ new Map();
  hits = 0;
  misses = 0;
  get enabled() {
    return this.mode !== false;
  }
  get stats() {
    return { hits: this.hits, misses: this.misses };
  }
  /** Look up a cached blueprint by key, counting hits/misses. */
  get(key) {
    if (!this.enabled) return null;
    let entry = this.mem.get(key) ?? null;
    if (!entry && this.mode === "session") {
      entry = this.readSession(key);
      if (entry) this.mem.set(key, entry);
    }
    if (entry) {
      this.hits++;
      return entry.blueprint;
    }
    this.misses++;
    return null;
  }
  /** Store a blueprint, evicting the oldest entry when over capacity (LRU-ish). */
  set(fingerprint, blueprint, storedAt) {
    if (!this.enabled) return;
    const entry = { blueprint, route: fingerprint.route, storedAt };
    if (this.mem.size >= this.maxEntries && !this.mem.has(fingerprint.key)) {
      const oldest = this.mem.keys().next().value;
      if (oldest !== void 0) this.mem.delete(oldest);
    }
    this.mem.set(fingerprint.key, entry);
    if (this.mode === "session") this.writeSession(fingerprint.key, entry);
  }
  /** Drop a single entry by key (e.g. when a host's content changes). */
  invalidate(key) {
    this.mem.delete(key);
    if (this.mode === "session" && typeof sessionStorage !== "undefined") {
      try {
        sessionStorage.removeItem(SS_PREFIX + key);
      } catch {
      }
    }
  }
  /** Drop every entry stored for a route (route-change invalidation). */
  invalidateRoute(route) {
    for (const [key, entry] of this.mem) {
      if (entry.route === route) this.invalidate(key);
    }
  }
  /** Drop everything (both tiers). */
  clear() {
    this.mem.clear();
    if (this.mode === "session" && typeof sessionStorage !== "undefined") {
      try {
        for (const key of Object.keys(sessionStorage)) {
          if (key.startsWith(SS_PREFIX)) sessionStorage.removeItem(key);
        }
      } catch {
      }
    }
  }
  readSession(key) {
    if (typeof sessionStorage === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(SS_PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  writeSession(key, entry) {
    if (typeof sessionStorage === "undefined") return;
    try {
      sessionStorage.setItem(SS_PREFIX + key, JSON.stringify(entry));
    } catch {
    }
  }
}
