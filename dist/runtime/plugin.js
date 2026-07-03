import { defineNuxtPlugin, useRuntimeConfig } from "#imports";
import { registerDirectives } from "./directives/index.js";
import { createSkeletonizerStore, setActiveStore, SKELETONIZER_KEY } from "./state.js";
import { applyBaseTheme } from "./theme/theme.js";
export default defineNuxtPlugin({
  name: "nuxt-skeletonizer",
  // Run early so the store/directives exist before components mount.
  enforce: "pre",
  setup(nuxtApp) {
    const config = useRuntimeConfig().public.skeletonizer;
    const store = createSkeletonizerStore(config);
    setActiveStore(store);
    nuxtApp.vueApp.provide(SKELETONIZER_KEY, store);
    registerDirectives(nuxtApp.vueApp);
    if (import.meta.client) {
      applyBaseTheme(config);
    }
    return {
      provide: {
        skeletonizer: store
      }
    };
  }
});
