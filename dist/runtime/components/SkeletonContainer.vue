<script setup>
import { computed } from "vue";
import { cssSize } from "../utils";
defineOptions({ name: "SkeletonContainer" });
const props = defineProps({
  layout: { type: String, required: false, default: "flex" },
  direction: { type: String, required: false, default: "row" },
  columns: { type: Number, required: false, default: 2 },
  gap: { type: [String, Number], required: false, default: "1rem" },
  wrap: { type: Boolean, required: false, default: false },
  align: { type: String, required: false, default: "stretch" },
  justify: { type: String, required: false, default: "flex-start" },
  width: { type: [String, Number], required: false, default: "100%" }
});
const style = computed(() => {
  const base = {
    gap: cssSize(props.gap),
    width: cssSize(props.width),
    alignItems: props.align,
    justifyContent: props.justify
  };
  if (props.layout === "grid") {
    return {
      ...base,
      display: "grid",
      gridTemplateColumns: `repeat(${Math.max(1, props.columns)}, 1fr)`
    };
  }
  return {
    ...base,
    display: "flex",
    flexDirection: props.direction,
    flexWrap: props.wrap ? "wrap" : "nowrap"
  };
});
</script>

<template>
  <div class="sk-container" :style="style" aria-hidden="true">
    <slot />
  </div>
</template>
