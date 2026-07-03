<script setup>
import { computed } from "vue";
import { cssSize, pxSize } from "../utils";
import SkeletonSvg from "./SkeletonSvg";
import { useSvgPrimitive } from "./useSvgPrimitive";
defineOptions({ name: "SkeletonCard" });
const props = defineProps({
  loading: { type: Boolean, required: false, default: void 0 },
  isLoading: { type: Boolean, required: false, default: void 0 },
  showSkeleton: { type: Boolean, required: false, default: void 0 },
  animation: { type: [String, Object], required: false, default: void 0 },
  shimmer: { type: Boolean, required: false, default: void 0 },
  media: { type: Boolean, required: false, default: true },
  avatar: { type: Boolean, required: false, default: true },
  footer: { type: Boolean, required: false, default: false },
  lines: { type: Number, required: false, default: 3 },
  width: { type: [String, Number], required: false, default: "100%" },
  padding: { type: [String, Number], required: false, default: "1rem" },
  radius: { type: [String, Number], required: false, default: "0.75rem" }
});
const { loading, mode, gradId, fill, durSec } = useSvgPrimitive(props);
const MEDIA_H = 160;
const AVATAR = 44;
const LINE_H = 13;
const LINE_GAP = 12;
const GAP = 14;
const pad = computed(() => pxSize(props.padding, 16));
const lineCount = computed(() => Math.max(1, Math.floor(props.lines)));
const layout = computed(() => {
  const shapes2 = [];
  const mediaH = props.media ? MEDIA_H : 0;
  if (props.media) {
    shapes2.push({ type: "rect", x: 0, y: 0, w: "100%", h: mediaH, rx: 0 });
  }
  const contentTop = mediaH + pad.value;
  let afterHeader = contentTop;
  if (props.avatar) {
    shapes2.push({ type: "circle", cx: pad.value + AVATAR / 2, cy: contentTop + AVATAR / 2, r: AVATAR / 2 });
    const tx = pad.value + AVATAR + 12;
    shapes2.push({ type: "rect", x: tx, y: contentTop + 4, w: "55%", h: 12, rx: 3 });
    shapes2.push({ type: "rect", x: tx, y: contentTop + 24, w: "35%", h: 10, rx: 3 });
    afterHeader = contentTop + AVATAR + GAP;
  }
  for (let i = 0; i < lineCount.value; i++) {
    const isLast = i === lineCount.value - 1;
    shapes2.push({
      type: "rect",
      x: pad.value,
      y: afterHeader + i * (LINE_H + LINE_GAP),
      w: isLast ? "70%" : "90%",
      h: LINE_H,
      rx: 3
    });
  }
  let bodyEnd = afterHeader + lineCount.value * LINE_H + (lineCount.value - 1) * LINE_GAP;
  if (props.footer) {
    shapes2.push({ type: "rect", x: pad.value, y: bodyEnd + GAP, w: 96, h: 38, rx: 8 });
    bodyEnd += GAP + 38;
  }
  return { shapes: shapes2, totalH: bodyEnd + pad.value };
});
const shapes = computed(() => layout.value.shapes);
const totalH = computed(() => layout.value.totalH);
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
