import { computed, inject } from "vue";
import { getActiveStore, SKELETONIZER_KEY } from "../state.js";
function resolveStore() {
  const store = inject(SKELETONIZER_KEY, null) ?? getActiveStore();
  if (!store) {
    throw new Error("[nuxt-skeletonizer] useSkeletonPerformance() called before the plugin initialised.");
  }
  return store;
}
export function useSkeletonPerformance() {
  const store = resolveStore();
  const engine = store.engine;
  return {
    stats: store.stats,
    engine,
    telemetry: () => engine.telemetry.aggregate(),
    series: (metric, n) => engine.telemetry.series(metric, n),
    explanations: () => engine.explain.list(),
    lastExplanation: computed(() => engine.explain.latest()),
    bottlenecks: () => engine.bottleneck.ranked(),
    cacheHitRatio: computed(() => {
      const { cacheHits, cacheMisses } = store.stats;
      const total = cacheHits + cacheMisses;
      return total === 0 ? 0 : cacheHits / total;
    }),
    blueprint: () => engine.lastResult?.blueprint ?? null
  };
}
