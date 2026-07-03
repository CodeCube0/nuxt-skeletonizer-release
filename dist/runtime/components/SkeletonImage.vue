<script setup>
import { computed } from "vue";
import { cssSize, pxSize } from "../utils";
import SkeletonSvg from "./SkeletonSvg";
import { useSvgPrimitive } from "./useSvgPrimitive";
defineOptions({ name: "SkeletonImage" });
const props = defineProps({
  loading: { type: Boolean, required: false, default: void 0 },
  isLoading: { type: Boolean, required: false, default: void 0 },
  showSkeleton: { type: Boolean, required: false, default: void 0 },
  animation: { type: [String, Object], required: false, default: void 0 },
  shimmer: { type: Boolean, required: false, default: void 0 },
  width: { type: [String, Number], required: false, default: "100%" },
  height: { type: [String, Number], required: false, default: void 0 },
  aspectRatio: { type: [String, Number], required: false, default: "16 / 9" },
  radius: { type: [String, Number], required: false, default: "0.5rem" }
});
const { loading, mode, gradId, fill, durSec } = useSvgPrimitive(props);
const shapes = computed(() => [{ type: "rect", rx: pxSize(props.radius, 8) }]);
const svgStyle = computed(
  () => props.height ? {} : { aspectRatio: String(props.aspectRatio) }
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
    :svg-style="svgStyle"
  />
</template>
