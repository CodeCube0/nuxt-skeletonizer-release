import { computed, inject } from "vue";
import { getActiveStore, SKELETONIZER_KEY } from "../state.js";
function resolveStore() {
  const injected = inject(SKELETONIZER_KEY, null);
  const store = injected ?? getActiveStore();
  if (!store) {
    throw new Error(
      "[nuxt-skeletonizer] useSkeletonizer() was called before the plugin initialised. Ensure the module is registered in nuxt.config and that you call it within a component setup or Nuxt runtime context."
    );
  }
  return store;
}
export function useSkeletonizer() {
  const store = resolveStore();
  return {
    enable: store.enable,
    disable: store.disable,
    toggle: store.toggle,
    isEnabled: computed(() => store.isEnabled.value),
    config: store.config,
    refresh: store.refresh,
    scan: store.scan,
    stats: store.stats,
    setTheme: store.setTheme,
    setAnimation: store.setAnimation,
    registerAnimation: store.registerAnimation,
    engine: store.engine
  };
}
