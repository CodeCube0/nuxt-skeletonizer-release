export function clampViewBox(rect) {
  const w = Math.max(0, rect.width);
  const h = Math.max(0, rect.height);
  return `0 0 ${w} ${h}`;
}
export function measureCls() {
  const PO = globalThis.PerformanceObserver;
  if (typeof PO !== "function") {
    return { stop: () => 0 };
  }
  let total = 0;
  let observer = null;
  try {
    observer = new PO((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput && typeof entry.value === "number") total += entry.value;
      }
    });
    observer.observe({ type: "layout-shift", buffered: true });
  } catch {
    return { stop: () => 0 };
  }
  return {
    stop: () => {
      observer?.disconnect();
      return Math.round(total * 1e4) / 1e4;
    }
  };
}
