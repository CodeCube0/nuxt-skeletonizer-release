import { defineNuxtModule, createResolver, addPlugin, addImports, addComponent } from '@nuxt/kit';
import { defu } from 'defu';

const COMPONENTS = [
  "Skeletonizer",
  "SkeletonBlock",
  "SkeletonText",
  "SkeletonAvatar",
  "SkeletonImage",
  "SkeletonButton",
  "SkeletonCard",
  "SkeletonContainer",
  "SkeletonList",
  "SkeletonTable"
];
const defaults = {
  enabled: true,
  autoScan: true,
  shimmer: true,
  shimmerDuration: 1200,
  animation: "wave",
  baseColor: "#e5e7eb",
  highlightColor: "#f8fafc",
  darkBaseColor: "#2a2a2a",
  darkHighlightColor: "#3a3a3a",
  borderRadius: "0.375rem",
  opacity: 1,
  respectBorderRadius: true,
  debug: false,
  darkModeSelector: ".dark",
  scanDebounce: 50,
  maxScanDepth: 64,
  // SVG renderer — the only backend.
  renderMode: "svg",
  svgPrecision: 1,
  svgSharedGradient: true,
  // Adaptive / telemetry. All conservative (off) so the engine stays a pure
  // SVG painter unless these are explicitly enabled.
  adaptive: false,
  minFps: 45,
  telemetry: false,
  offThread: false,
  layoutCache: false,
  explain: false
};
const module$1 = defineNuxtModule({
  meta: {
    name: "nuxt-skeletonizer",
    configKey: "skeletonizer",
    compatibility: {
      nuxt: ">=3.10.0"
    }
  },
  defaults,
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const config = defu(options, defaults);
    nuxt.options.runtimeConfig.public.skeletonizer = defu(
      nuxt.options.runtimeConfig.public.skeletonizer,
      config
    );
    nuxt.options.build.transpile.push(resolver.resolve("./runtime"));
    nuxt.options.css.push(resolver.resolve("./runtime/css/skeletonizer.css"));
    addPlugin({
      src: resolver.resolve("./runtime/plugin"),
      mode: "all"
    });
    addImports({
      name: "useSkeletonizer",
      as: "useSkeletonizer",
      from: resolver.resolve("./runtime/composables/useSkeletonizer")
    });
    addImports({
      name: "useSkeletonPerformance",
      as: "useSkeletonPerformance",
      from: resolver.resolve("./runtime/composables/useSkeletonPerformance")
    });
    const dataComposables = resolver.resolve("./runtime/composables/useSkeletonData");
    for (const name of [
      "useSkeletonFetch",
      "useSkeletonLazyFetch",
      "useSkeletonAsyncData",
      "useSkeletonLazyAsyncData"
    ]) {
      addImports({ name, as: name, from: dataComposables });
    }
    for (const name of COMPONENTS) {
      addComponent({
        name,
        filePath: resolver.resolve(`./runtime/components/${name}.vue`),
        mode: "all"
      });
    }
    const onCustomTabs = nuxt.hook;
    onCustomTabs("devtools:customTabs", (tabs) => {
      tabs.push({
        name: "skeletonizer",
        title: "Skeletonizer",
        icon: "carbon:skeleton-3d",
        category: "modules",
        view: {
          type: "iframe",
          src: "/__skeletonizer_devtools__"
        }
      });
    });
    nuxt.options.appConfig.skeletonizer = config;
    if (config.debug) {
      console.info("[nuxt-skeletonizer] resolved config:", config);
    }
  }
});

export { module$1 as default, defaults };
