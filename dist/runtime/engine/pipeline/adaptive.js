const SHIMMER_CPU_CEILING = 0.85;
export function resolveDecision(input) {
  const { signals, microTier, config } = input;
  const reasons = [];
  const animationTier = config.adaptive ? microTier : signals.reducedMotion ? "static" : "full";
  let shimmer = config.shimmer;
  if (config.adaptive && shimmer && signals.cpu >= SHIMMER_CPU_CEILING) {
    shimmer = false;
    reasons.push({ code: "disable:shimmer", detail: { cpu: signals.cpu.toFixed(2), fps: signals.fps } });
  }
  if (animationTier !== "full") {
    reasons.push({ code: "degrade:animation", detail: { tier: animationTier, fps: signals.fps } });
  }
  return { animationTier, shimmer, reasons };
}
