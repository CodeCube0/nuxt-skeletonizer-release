import { computed, onMounted, ref, useId } from "vue";
import { prefersReducedMotion } from "../engine/perf/score.js";
import { gradientId } from "../engine/render/svg.js";
import { useSkeletonStore } from "../utils.js";
import { usePrimitive } from "./usePrimitive.js";
function toMode(anim) {
  if (anim === "none") return "none";
  if (anim === "pulse" || anim === "fade") return "pulse";
  return "sweep";
}
export function useSvgPrimitive(props) {
  const { loading, anim } = usePrimitive(props);
  const store = useSkeletonStore();
  const uid = useId() ?? "sk";
  const reduced = ref(false);
  onMounted(() => {
    reduced.value = prefersReducedMotion();
  });
  const mode = computed(() => reduced.value ? "none" : toMode(anim.value));
  const gradId = computed(() => gradientId(uid));
  const fill = computed(() => mode.value === "none" ? "var(--sk-bg)" : `url(#${gradId.value})`);
  const durSec = computed(() => `${Math.max(0, store?.config.shimmerDuration ?? 1200) / 1e3}s`);
  return { loading, mode, gradId, fill, durSec };
}
