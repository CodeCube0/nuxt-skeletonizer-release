<script setup>
import { computed } from "vue";
import { cssSize, pxSize } from "../utils";
import SkeletonSvg from "./SkeletonSvg";
import { useSvgPrimitive } from "./useSvgPrimitive";
defineOptions({ name: "SkeletonAvatar" });
const props = defineProps({
  loading: { type: Boolean, required: false, default: void 0 },
  isLoading: { type: Boolean, required: false, default: void 0 },
  showSkeleton: { type: Boolean, required: false, default: void 0 },
  animation: { type: [String, Object], required: false, default: void 0 },
  shimmer: { type: Boolean, required: false, default: void 0 },
  size: { type: [String, Number], required: false, default: 40 },
  shape: { type: String, required: false, default: "circle" },
  radius: { type: [String, Number], required: false, default: "0.5rem" }
});
const { loading, mode, gradId, fill, durSec } = useSvgPrimitive(props);
const shapes = computed(
  () => props.shape === "circle" ? [{ type: "circle" }] : [{ type: "rect", rx: pxSize(props.radius, 8) }]
);
</script>

<template>
  <slot v-if="!loading" />
  <SkeletonSvg
    v-else
    :width="cssSize(props.size)"
    :height="cssSize(props.size)"
    :mode="mode"
    :grad-id="gradId"
    :fill="fill"
    :dur-sec="durSec"
    :shapes="shapes"
    :svg-style="{ flex: '0 0 auto' }"
  />
</template>
