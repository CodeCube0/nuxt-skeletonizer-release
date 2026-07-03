<script setup>
import { computed } from "vue";
import { pxSize } from "../utils";
import SkeletonSvg from "./SkeletonSvg";
import { useSvgPrimitive } from "./useSvgPrimitive";
defineOptions({ name: "SkeletonList" });
const props = defineProps({
  loading: { type: Boolean, required: false, default: void 0 },
  isLoading: { type: Boolean, required: false, default: void 0 },
  showSkeleton: { type: Boolean, required: false, default: void 0 },
  animation: { type: [String, Object], required: false, default: void 0 },
  shimmer: { type: Boolean, required: false, default: void 0 },
  items: { type: Number, required: false, default: 5 },
  avatar: { type: Boolean, required: false, default: true },
  lines: { type: Number, required: false, default: 2 },
  gap: { type: [String, Number], required: false, default: "1rem" },
  avatarSize: { type: [String, Number], required: false, default: 40 }
});
const { loading, mode, gradId, fill, durSec } = useSvgPrimitive(props);
const count = computed(() => Math.max(1, Math.floor(props.items)));
const lineCount = computed(() => Math.max(1, Math.floor(props.lines)));
const avatarPx = computed(() => pxSize(props.avatarSize, 40));
const rowGap = computed(() => pxSize(props.gap, 16));
const LINE_H = 13;
const LINE_GAP = 8;
const linesBlockH = computed(() => lineCount.value * LINE_H + (lineCount.value - 1) * LINE_GAP);
const rowH = computed(() => Math.max(props.avatar ? avatarPx.value : 0, linesBlockH.value));
const totalH = computed(() => count.value * rowH.value + (count.value - 1) * rowGap.value);
const shapes = computed(() => {
  const out = [];
  const textX = props.avatar ? avatarPx.value + 12 : 0;
  for (let row = 0; row < count.value; row++) {
    const yBase = row * (rowH.value + rowGap.value);
    if (props.avatar) {
      out.push({ type: "circle", cx: avatarPx.value / 2, cy: yBase + rowH.value / 2, r: avatarPx.value / 2 });
    }
    const linesTop = yBase + (rowH.value - linesBlockH.value) / 2;
    for (let i = 0; i < lineCount.value; i++) {
      const isLast = i === lineCount.value - 1;
      out.push({
        type: "rect",
        x: textX,
        y: linesTop + i * (LINE_H + LINE_GAP),
        w: isLast ? "50%" : "85%",
        h: LINE_H,
        rx: 3
      });
    }
  }
  return out;
});
</script>

<template>
  <slot v-if="!loading" />
  <SkeletonSvg
    v-else
    width="100%"
    :height="totalH"
    :mode="mode"
    :grad-id="gradId"
    :fill="fill"
    :dur-sec="durSec"
    :shapes="shapes"
    :svg-style="{ display: 'block' }"
  />
</template>
