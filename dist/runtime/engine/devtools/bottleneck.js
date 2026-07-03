export class BottleneckTracker {
  hosts = /* @__PURE__ */ new Map();
  /** Fold a sample for a host into its running means. */
  record(id, label, scanMs, renderMs, bones) {
    const prev = this.hosts.get(id);
    if (!prev) {
      this.hosts.set(id, { id, label, scanMs, renderMs, bones, samples: 1 });
      return;
    }
    const n = prev.samples + 1;
    prev.scanMs = prev.scanMs + (scanMs - prev.scanMs) / n;
    prev.renderMs = prev.renderMs + (renderMs - prev.renderMs) / n;
    prev.bones = bones;
    prev.label = label;
    prev.samples = n;
  }
  /** Drop a host that has unmounted. */
  forget(id) {
    this.hosts.delete(id);
  }
  /** Hosts ranked by total (scan+render) cost, slowest first. */
  ranked() {
    return Array.from(this.hosts.values()).sort((a, b) => b.scanMs + b.renderMs - (a.scanMs + a.renderMs));
  }
  /** The single worst offender, if any. */
  worst() {
    return this.ranked()[0] ?? null;
  }
  clear() {
    this.hosts.clear();
  }
}
