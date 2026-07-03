import { CLASS } from "../../constants.js";
import { AnimationMicrocontroller, tierToAnimation } from "../animation/microcontroller.js";
import { now } from "../clock.js";
import { BottleneckTracker } from "../devtools/bottleneck.js";
import { ExplainLog, explainDecision } from "../devtools/explain.js";
import { LayoutFingerprintCache, layoutFingerprint } from "../intelligence/fingerprint.js";
import { FpsSampler } from "../perf/fps.js";
import { computeScore, prefersReducedMotion, readCores, readMemoryMB } from "../perf/score.js";
import { buildBlueprint } from "../render/svg.js";
import { scanSubtree } from "../scanner.js";
import { OffThreadCompute } from "../telemetry/offthread.js";
import { TelemetryCollector } from "../telemetry/telemetry.js";
import { resolveDecision } from "./adaptive.js";
const EMPTY_TIMINGS = { scanMs: 0, renderMs: 0, totalMs: 0 };
const EMPTY_BLUEPRINT = {
  svg: "",
  nodeCount: 0,
  width: 0,
  height: 0,
  gradientId: "",
  tier: "full"
};
function currentRoute() {
  return typeof location !== "undefined" ? location.pathname : "/";
}
function currentViewport() {
  return typeof window !== "undefined" ? { width: window.innerWidth, height: window.innerHeight } : { width: 0, height: 0 };
}
function radiusToPx(value) {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return 0;
  if (value.includes("rem") || value.includes("em")) return n * 16;
  if (value.includes("%")) return 0;
  return n;
}
export class SkeletonEngine {
  constructor(getConfig) {
    this.getConfig = getConfig;
    const cfg = getConfig();
    this.fps = new FpsSampler({});
    this.micro = new AnimationMicrocontroller({ minFps: cfg.minFps });
    this.cache = new LayoutFingerprintCache(cfg.layoutCache);
    this.telemetry = new TelemetryCollector();
    this.explain = new ExplainLog(100, cfg.explain);
    this.bottleneck = new BottleneckTracker();
    this.offthread = new OffThreadCompute(cfg.offThread);
  }
  fps;
  micro;
  cache;
  telemetry;
  explain;
  bottleneck;
  offthread;
  /** Mounted overlay per host element, so teardown is exact. */
  overlays = /* @__PURE__ */ new WeakMap();
  /** The last fingerprint key used per host id (for targeted invalidation). */
  hostKey = /* @__PURE__ */ new Map();
  booted = now();
  loading = false;
  /** The route the cache was last keyed against, for route-change eviction. */
  lastRoute = currentRoute();
  /** Most recent host render result, surfaced as global display stats. */
  lastResult = null;
  /** Toggle the loading phase — starts/stops FPS sampling (TAR §1). */
  setLoading(on) {
    if (on === this.loading) return;
    this.loading = on;
    const cfg = this.getConfig();
    const wantsSampling = cfg.adaptive || cfg.telemetry;
    if (on && wantsSampling) this.fps.start();
    else this.fps.stop();
  }
  get isLoading() {
    return this.loading;
  }
  /** Build the live runtime signals fed to the score and microcontroller. */
  signals(boneCount) {
    const fps = this.fps.active ? this.fps.fps : 0;
    const cpu = this.fps.active ? this.fps.cpu : 0;
    const memoryMB = readMemoryMB();
    const score = computeScore({ fps: fps || 60, cpu, memoryMB, boneCount }, {
      minFps: this.getConfig().minFps,
      heavyNodes: 1500,
      memoryCeilingMB: 512
    }).value;
    return {
      fps,
      cpu,
      boneCount,
      memoryMB,
      score,
      loading: this.loading,
      cores: readCores(),
      reducedMotion: prefersReducedMotion()
    };
  }
  /** Keep mutable subsystems in sync with the (reactive) config each render. */
  syncConfig(cfg) {
    this.explain.setEnabled(cfg.explain);
  }
  /**
   * Run the full SVG pipeline for one host: scan (or replay from cache) → build
   * the `<svg>` blueprint → inject it as an overlay → record telemetry. Returns
   * the figures the store/host surface as live stats.
   */
  renderHost(host, meta) {
    const cfg = this.getConfig();
    this.syncConfig(cfg);
    const t0 = now();
    const at = t0 - this.booted;
    const route = currentRoute();
    const viewport = currentViewport();
    const uid = String(meta.id);
    if (route !== this.lastRoute) {
      this.cache.invalidateRoute(this.lastRoute);
      this.lastRoute = route;
    }
    const fingerprint = layoutFingerprint(route, viewport, uid);
    const microTier = this.micro.update(this.signals(this.lastResult?.bones ?? 0), at);
    const decisionSignals = this.signals(this.lastResult?.bones ?? 0);
    const decision = resolveDecision({
      signals: decisionSignals,
      microTier,
      config: { shimmer: meta.shimmer, adaptive: cfg.adaptive }
    });
    for (const r of decision.reasons) {
      this.explain.push(r.code, explainDecision(r.code, r.detail), at);
    }
    const scanStart = now();
    let blueprint = null;
    let fromCache = false;
    let bones = 0;
    let ignored = 0;
    let scannedNodes = [];
    if (cfg.layoutCache !== false) {
      const cached = this.cache.get(fingerprint.key);
      if (cached && cached.tier === decision.animationTier) {
        blueprint = cached;
        fromCache = true;
        bones = cached.nodeCount;
        this.telemetry.noteCache(true);
        this.explain.push("cache:hit", explainDecision("cache:hit", { nodes: cached.nodeCount }), at);
      } else {
        this.telemetry.noteCache(false);
      }
    }
    if (!blueprint) {
      const scan = scanSubtree(host, {
        respectBorderRadius: cfg.respectBorderRadius,
        defaultRadius: radiusToPx(cfg.borderRadius),
        maxDepth: cfg.maxScanDepth,
        debug: cfg.debug
      });
      ignored = scan.ignored;
      scannedNodes = scan.nodes;
      const containerRect = host.getBoundingClientRect();
      blueprint = buildBlueprint(
        scan.nodes,
        { x: 0, y: 0, width: containerRect.width, height: containerRect.height },
        {
          precision: cfg.svgPrecision,
          sharedGradient: cfg.svgSharedGradient,
          shimmer: decision.shimmer,
          animation: this.animationFor(decision.animationTier, meta.animation),
          tier: decision.animationTier,
          uid,
          respectBorderRadius: cfg.respectBorderRadius,
          durationMs: cfg.shimmerDuration
        }
      );
      bones = blueprint.nodeCount;
      if (cfg.layoutCache !== false) {
        this.cache.set(fingerprint, blueprint, at);
      }
    }
    const scanMs = now() - scanStart;
    this.hostKey.set(meta.id, fingerprint.key);
    const renderStart = now();
    this.mountOverlay(host, blueprint.svg);
    const renderMs = now() - renderStart;
    const totalMs = now() - t0;
    const timings = { scanMs, renderMs, totalMs };
    if (cfg.telemetry) {
      this.telemetry.record({
        at,
        timings,
        fps: decisionSignals.fps,
        cpu: decisionSignals.cpu,
        memoryMB: decisionSignals.memoryMB,
        boneCount: bones,
        strategy: "svg"
      });
      this.bottleneck.record(meta.id, meta.label, scanMs, renderMs, bones);
      if (cfg.offThread) void this.offthread.run({ type: "fingerprint", payload: blueprint.svg });
    }
    const result = {
      bones,
      ignored,
      lastScanMs: totalMs,
      animationTier: decision.animationTier,
      shimmer: decision.shimmer,
      timings,
      fromCache,
      blueprint,
      nodes: scannedNodes
    };
    this.lastResult = result;
    return result;
  }
  /** Hide the host content and mount the SVG overlay (zero CLS). */
  mountOverlay(host, svg) {
    this.unmountOverlay(host);
    const prevPosition = host.style.position;
    if (typeof getComputedStyle === "function" && getComputedStyle(host).position === "static") {
      host.style.position = "relative";
    }
    host.classList.add(CLASS.svgHidden);
    const overlay = document.createElement("div");
    overlay.className = CLASS.overlay;
    overlay.innerHTML = svg;
    host.appendChild(overlay);
    this.overlays.set(host, { overlay, prevPosition });
  }
  /** Remove the overlay and restore the host's content visibility. */
  unmountOverlay(host) {
    const state = this.overlays.get(host);
    if (!state) return;
    state.overlay.remove();
    host.classList.remove(CLASS.svgHidden);
    host.style.position = state.prevPosition;
    if (!host.getAttribute("style")) host.removeAttribute("style");
    this.overlays.delete(host);
  }
  /** Whether an overlay is currently mounted on the host. */
  hasOverlay(host) {
    return this.overlays.has(host);
  }
  /** Aggregate, display-facing snapshot for the store stats / DevTools. */
  snapshot(boneCount) {
    const s = this.signals(boneCount);
    const last = this.lastResult;
    const cache = this.cache.stats;
    return {
      animationTier: last?.animationTier ?? this.micro.tier,
      score: s.score,
      fps: s.fps,
      memoryMB: s.memoryMB,
      cacheHits: cache.hits,
      cacheMisses: cache.misses,
      degraded: last ? last.animationTier !== "full" || !last.shimmer : false,
      timings: last?.timings ?? { ...EMPTY_TIMINGS }
    };
  }
  /** Tear down the overlay mounted on a host and forget its cache key. */
  teardownHost(host, id) {
    this.unmountOverlay(host);
    this.hostKey.delete(id);
    this.bottleneck.forget(id);
  }
  /** Invalidate a host's cached blueprint so the next scan rebuilds it. */
  invalidateHost(id) {
    const key = this.hostKey.get(id);
    if (key) this.cache.invalidate(key);
  }
  /** The animation preset name to apply for a tier (CSS layer). */
  animationFor(tier, base) {
    return tierToAnimation(tier, base);
  }
  /** Stop sampling and release worker/loop resources. */
  dispose() {
    this.fps.stop();
    this.offthread.dispose();
    this.hostKey.clear();
  }
  /** Empty timings constant (for hosts that never rendered). */
  static get emptyTimings() {
    return { ...EMPTY_TIMINGS };
  }
  /** Empty blueprint constant (for the initial `scan()` return). */
  static get emptyBlueprint() {
    return { ...EMPTY_BLUEPRINT };
  }
}
