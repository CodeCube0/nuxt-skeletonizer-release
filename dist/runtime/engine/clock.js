export function now() {
  return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : 0;
}
export function raf(cb) {
  if (typeof requestAnimationFrame === "function") return requestAnimationFrame(cb);
  return setTimeout(() => cb(now()), 16);
}
export function cancelRaf(id) {
  if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(id);
  else clearTimeout(id);
}
export function idle(cb, timeout = 50) {
  const ric = globalThis.requestIdleCallback;
  if (typeof ric === "function") return ric(cb, { timeout });
  return setTimeout(cb, 1);
}
export function cancelIdle(id) {
  const cic = globalThis.cancelIdleCallback;
  if (typeof cic === "function") cic(id);
  else clearTimeout(id);
}
