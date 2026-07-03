import { computed, inject } from "vue";
import { SKELETON_SCOPE_KEY } from "../state.js";
import { useSkeletonStore } from "../utils.js";
export function usePrimitive(props) {
  const store = useSkeletonStore();
  const scope = inject(SKELETON_SCOPE_KEY, null);
  const loading = computed(() => {
    if (props.loading !== void 0) return props.loading;
    if (props.isLoading !== void 0) return props.isLoading;
    if (props.showSkeleton !== void 0) return props.showSkeleton;
    if (scope) return scope.value;
    return true;
  });
  const anim = computed(() => {
    const shimmer = props.shimmer ?? store?.config.shimmer ?? true;
    if (!shimmer) return "none";
    return props.animation ?? store?.config.animation ?? "wave";
  });
  return { loading, anim };
}
