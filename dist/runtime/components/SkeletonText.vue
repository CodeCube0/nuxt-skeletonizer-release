<script setup>
import { computed } from "vue";
import { cssSize, pxSize, svgWidthValue } from "../utils";
import SkeletonSvg from "./SkeletonSvg";
import { useSvgPrimitive } from "./useSvgPrimitive";
defineOptions({ name: "SkeletonText" });
const props = defineProps({
  loading: { type: Boolean, required: false, default: void 0 },
  isLoading: { type: Boolean, required: false, default: void 0 },
  showSkeleton: { type: Boolean, required: false, default: void 0 },
  animation: { type: [String, Object], required: false, default: void 0 },
  shimmer: { type: Boolean, required: false, default: void 0 },
  lines: { type: Number, required: false, default: 3 },
  lineHeight: { type: [String, Number], required: false, default: "0.85rem" },
  gap: { type: [String, Number], required: false, default: "0.55rem" },
  lastLineWidth: { type: [String, Number], required: false, default: "60%" },
  width: { type: [String, Number], required: false, default: "100%" },
  radius: { type: [String, Number], required: false, default: void 0 }
});
const { loading, mode, gradId, fill, durSec } = useSvgPrimitive(props);
const count = computed(() => Math.max(1, Math.floor(props.lines)));
const lineH = computed(() => pxSize(props.lineHeight, 14));
const gapH = computed(() => pxSize(props.gap, 9));
const totalH = computed(() => count.value * lineH.value + (count.value - 1) * gapH.value);
const rx = computed(() => Math.min(4, Math.round(lineH.value / 3)));
const shapes = computed(() => {
  const out = [];
  for (let i = 0; i < count.value; i++) {
    const isLast = i === count.value - 1 && count.value > 1;
    out.push({
      type: "rect",
      x: 0,
      y: i * (lineH.value + gapH.value),
      w: isLast ? svgWidthValue(props.lastLineWidth) : "100%",
      h: lineH.value,
      rx: rx.value
    });
  }
  return out;
});
</script>

<template>
  <slot v-if="!loading" />
  <SkeletonSvg
    v-else
    :width="cssSize(props.width)"
    :height="totalH"
    :mode="mode"
    :grad-id="gradId"
    :fill="fill"
    :dur-sec="durSec"
    :shapes="shapes"
    :svg-style="{ display: 'block' }"
  />
</template>
