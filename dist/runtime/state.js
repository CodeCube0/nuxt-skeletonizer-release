import { computed, reactive, ref } from "vue";
import { registerAnimation as registerAnimationCss } from "./animations/index.js";
import { SkeletonEngine } from "./engine/pipeline/index.js";
import { setThemeTokens } from "./theme/theme.js";
export function createSkeletonizerStore(config) {
  const reactiveConfig = reactive({ ...config });
  const enabled = ref(config.enabled);
  const loadingCount = ref(0);
  const isEnabled = computed(() => enabled.value || loadingCount.value > 0);
  const hosts = /* @__PURE__ */ new Set();
  let idSeq = 0;
  const engine = new SkeletonEngine(() => reactiveConfig);
  const stats = reactive({
    hosts: 0,
    bones: 0,
    ignored: 0,
    scans: 0,
    lastScanMs: 0,
    enabled: isEnabled.value,
    renderMode: "svg",
    score: 100,
    fps: 0,
    animationTier: "full",
    memoryMB: 0,
    cacheHits: 0,
    cacheMisses: 0,
    degraded: false,
    timings: SkeletonEngine.emptyTimings
  });
  const syncLoading = () => engine.setLoading(isEnabled.value);
  const recompute = () => {
    let bones = 0;
    let ignored = 0;
    let lastScanMs = 0;
    let animationTier;
    for (const host of hosts) {
      const r = host.report();
      bones += r.bones;
      ignored += r.ignored;
      lastScanMs = Math.max(lastScanMs, r.lastScanMs);
      if (r.animationTier) animationTier = r.animationTier;
    }
    stats.hosts = hosts.size;
    stats.bones = bones;
    stats.ignored = ignored;
    stats.lastScanMs = lastScanMs;
    stats.enabled = isEnabled.value;
    const snap = engine.snapshot(bones);
    stats.animationTier = animationTier ?? snap.animationTier;
    stats.score = snap.score;
    stats.fps = snap.fps;
    stats.memoryMB = snap.memoryMB;
    stats.cacheHits = snap.cacheHits;
    stats.cacheMisses = snap.cacheMisses;
    stats.degraded = snap.degraded;
    stats.timings = snap.timings;
  };
  const refresh = () => {
    for (const host of hosts) host.scan();
    stats.scans++;
    recompute();
  };
  const scan = () => {
    refresh();
    const last = engine.lastResult;
    return {
      nodes: last?.nodes ?? [],
      svg: last?.blueprint.svg ?? "",
      cacheHit: last?.fromCache ?? false
    };
  };
  const store = {
    config: reactiveConfig,
    enabled,
    isEnabled,
    loadingCount,
    stats,
    enable() {
      enabled.value = true;
      stats.enabled = isEnabled.value;
      syncLoading();
    },
    disable() {
      enabled.value = false;
      stats.enabled = isEnabled.value;
      syncLoading();
    },
    toggle() {
      enabled.value = !enabled.value;
      stats.enabled = isEnabled.value;
      syncLoading();
      return isEnabled.value;
    },
    beginLoading() {
      loadingCount.value++;
      stats.enabled = isEnabled.value;
      syncLoading();
    },
    endLoading() {
      loadingCount.value = Math.max(0, loadingCount.value - 1);
      stats.enabled = isEnabled.value;
      syncLoading();
    },
    refresh,
    scan,
    setTheme(tokens, target) {
      if (tokens.baseColor !== void 0) reactiveConfig.baseColor = tokens.baseColor;
      if (tokens.highlightColor !== void 0) reactiveConfig.highlightColor = tokens.highlightColor;
      if (tokens.darkBaseColor !== void 0) reactiveConfig.darkBaseColor = tokens.darkBaseColor;
      if (tokens.darkHighlightColor !== void 0) reactiveConfig.darkHighlightColor = tokens.darkHighlightColor;
      if (tokens.borderRadius !== void 0) reactiveConfig.borderRadius = tokens.borderRadius;
      if (tokens.opacity !== void 0) reactiveConfig.opacity = tokens.opacity;
      setThemeTokens(tokens, target);
    },
    setAnimation(animation) {
      reactiveConfig.animation = animation;
    },
    registerAnimation(def) {
      registerAnimationCss(def);
    },
    engine,
    _hosts: hosts,
    _register(host) {
      hosts.add(host);
      recompute();
    },
    _unregister(host) {
      hosts.delete(host);
      recompute();
    },
    _recompute: recompute,
    _nextId: () => ++idSeq
  };
  return store;
}
export const SKELETONIZER_KEY = Symbol("nuxt-skeletonizer");
export const SKELETON_SCOPE_KEY = Symbol("nuxt-skeletonizer-scope");
let activeStore = null;
export function setActiveStore(store) {
  activeStore = store;
}
export function getActiveStore() {
  return activeStore;
}
