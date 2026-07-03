<script setup>
import { computed } from "vue";
import { cssSize, pxSize } from "../utils";
import SkeletonSvg from "./SkeletonSvg";
import { useSvgPrimitive } from "./useSvgPrimitive";
defineOptions({ name: "SkeletonBlock" });
const props = defineProps({
  loading: { type: Boolean, required: false, default: void 0 },
  isLoading: { type: Boolean, required: false, default: void 0 },
  showSkeleton: { type: Boolean, required: false, default: void 0 },
  animation: { type: [String, Object], required: false, default: void 0 },
  shimmer: { type: Boolean, required: false, default: void 0 },
  width: { type: [String, Number], required: false, default: "100%" },
  height: { type: [String, Number], required: false, default: "1rem" },
  radius: { type: [String, Number], required: false, default: void 0 },
  circle: { type: Boolean, required: false, default: false },
  tag: { type: String, required: false, default: "span" }
});
const { loading, mode, gradId, fill, durSec } = useSvgPrimitive(props);
const shapes = computed(
  () => props.circle ? [{ type: "circle" }] : [{ type: "rect", rx: pxSize(props.radius, 6) }]
);
</script>

<template>
  <slot v-if="!loading" />
  <SkeletonSvg
    v-else
    :width="cssSize(props.width)"
    :height="cssSize(props.height)"
    :mode="mode"
    :grad-id="gradId"
    :fill="fill"
    :dur-sec="durSec"
    :shapes="shapes"
  />
</template>
