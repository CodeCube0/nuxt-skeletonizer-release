<script setup>
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  watch
} from "vue";
import { CLASS } from "../constants";
import { DebouncedObserver } from "../engine/observer";
import {
  getActiveStore,
  SKELETON_SCOPE_KEY,
  SKELETONIZER_KEY
} from "../state";
import { setThemeTokens } from "../theme/theme";
defineOptions({ name: "Skeletonizer", inheritAttrs: false });
const props = defineProps({
  enabled: { type: Boolean, required: false, default: void 0 },
  animation: { type: [String, Object], required: false, default: void 0 },
  shimmer: { type: Boolean, required: false, default: void 0 },
  autoScan: { type: Boolean, required: false, default: void 0 },
  theme: { type: Object, required: false, default: void 0 },
  tag: { type: String, required: false, default: "div" }
});
const store = inject(SKELETONIZER_KEY, null) ?? getActiveStore();
const root = ref(null);
let observer = null;
let controller = null;
const lastResult = reactive({ bones: 0, ignored: 0, lastScanMs: 0 });
const active = computed(() => {
  if (props.enabled !== void 0) return props.enabled;
  return store ? store.isEnabled.value : false;
});
provide(SKELETON_SCOPE_KEY, active);
const effectiveAnimation = computed(
  () => props.animation ?? store?.config.animation ?? "wave"
);
const effectiveShimmer = computed(
  () => props.shimmer ?? store?.config.shimmer ?? true
);
const effectiveAutoScan = computed(
  () => props.autoScan ?? store?.config.autoScan ?? true
);
const hostClass = computed(() => [
  CLASS.host,
  { [CLASS.active]: active.value }
]);
function report() {
  return lastResult;
}
function doScan() {
  if (!root.value || !store || !active.value) return;
  observer?.pause();
  const result = store.engine.renderHost(root.value, {
    id: controller?.id ?? 0,
    label: props.tag ?? "Skeletonizer",
    animation: effectiveAnimation.value,
    shimmer: effectiveShimmer.value
  });
  Object.assign(lastResult, {
    bones: result.bones,
    ignored: result.ignored,
    lastScanMs: result.lastScanMs,
    animationTier: result.animationTier,
    shimmer: result.shimmer,
    fromCache: result.fromCache,
    timings: result.timings
  });
  store._recompute();
}
function restore() {
  if (store && root.value) store.engine.teardownHost(root.value, controller?.id ?? 0);
  Object.assign(lastResult, { bones: 0, ignored: 0, lastScanMs: 0 });
  store?._recompute();
}
onMounted(() => {
  if (!root.value || !store) return;
  if (props.theme) setThemeTokens(props.theme, root.value);
  observer = new DebouncedObserver(() => {
    if (active.value && effectiveAutoScan.value) {
      store.engine.invalidateHost(controller?.id ?? 0);
      doScan();
    }
  }, store.config.scanDebounce);
  controller = {
    id: store._nextId(),
    scan: doScan,
    restore,
    report
  };
  store._register(controller);
  if (active.value) {
    nextTick(() => {
      doScan();
      if (effectiveAutoScan.value && root.value) observer?.observe(root.value);
    });
  }
});
watch(active, (isActive) => {
  if (!root.value) return;
  if (isActive) {
    nextTick(() => {
      doScan();
      if (effectiveAutoScan.value && root.value) observer?.observe(root.value);
    });
  } else {
    observer?.disconnect();
    restore();
  }
});
watch(
  () => props.theme,
  (theme) => {
    if (theme && root.value) setThemeTokens(theme, root.value);
  },
  { deep: true }
);
watch([effectiveAnimation, effectiveShimmer], () => {
  if (active.value) {
    store?.engine.invalidateHost(controller?.id ?? 0);
    nextTick(doScan);
  }
});
onBeforeUnmount(() => {
  observer?.disconnect();
  restore();
  if (controller) store?._unregister(controller);
});
defineExpose({ scan: doScan, restore, active });
</script>

<template>
  <component
    :is="props.tag"
    ref="root"
    :class="hostClass"
    :aria-busy="active || void 0"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
