export const DEFAULT_THRESHOLDS = {
  minFps: 45,
  heavyNodes: 1500,
  memoryCeilingMB: 512
};
function clamp100(n) {
  return Math.min(100, Math.max(0, n));
}
export function computeScore(signals, thresholds = DEFAULT_THRESHOLDS) {
  const { minFps, heavyNodes, memoryCeilingMB } = thresholds;
  const fpsScore = clamp100((signals.fps - minFps) / (60 - minFps) * 100);
  const cpuScore = clamp100((1 - signals.cpu) * 100);
  const memoryScore = memoryCeilingMB > 0 ? clamp100((1 - signals.memoryMB / memoryCeilingMB) * 100) : 100;
  const complexityScore = clamp100(100 / (1 + signals.boneCount / Math.max(1, heavyNodes)));
  const value = clamp100(
    fpsScore * 0.4 + cpuScore * 0.3 + complexityScore * 0.2 + memoryScore * 0.1
  );
  const subs = [
    ["fps", fpsScore],
    ["cpu", cpuScore],
    ["memory", memoryScore],
    ["complexity", complexityScore]
  ];
  let bottleneck = "none";
  let worst = 70;
  for (const [name, sub] of subs) {
    if (sub < worst) {
      worst = sub;
      bottleneck = name;
    }
  }
  return {
    value: Math.round(value),
    fps: Math.round(fpsScore),
    cpu: Math.round(cpuScore),
    memory: Math.round(memoryScore),
    complexity: Math.round(complexityScore),
    bottleneck
  };
}
export function readMemoryMB() {
  const mem = performance.memory;
  if (mem && typeof mem.usedJSHeapSize === "number") {
    return Math.round(mem.usedJSHeapSize / (1024 * 1024));
  }
  return 0;
}
export function readCores() {
  return typeof navigator !== "undefined" && typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : 0;
}
export function prefersReducedMotion() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
