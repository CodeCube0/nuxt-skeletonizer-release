import { useAsyncData, useFetch, useLazyAsyncData, useLazyFetch } from "#imports";
import { computed, inject, onScopeDispose, watch } from "vue";
import { getActiveStore, SKELETONIZER_KEY } from "../state.js";
function resolveStore() {
  return inject(SKELETONIZER_KEY, null) ?? getActiveStore();
}
function bindSkeleton(pending) {
  const store = resolveStore();
  if (!store) return;
  let counted = false;
  const release = () => {
    if (counted) {
      store.endLoading();
      counted = false;
    }
  };
  watch(
    pending,
    (isPending) => {
      if (isPending && !counted) {
        store.beginLoading();
        counted = true;
      } else if (!isPending) {
        release();
      }
    },
    { immediate: true }
  );
  onScopeDispose(release);
}
function withSkeleton(result, skeleton) {
  if (skeleton) {
    bindSkeleton(computed(() => result.status.value === "pending"));
  }
  return result;
}
function splitOptions(opts) {
  const { skeleton = true, ...rest } = opts ?? {};
  return { skeleton, rest };
}
export function useSkeletonFetch(request, opts) {
  const { skeleton, rest } = splitOptions(opts);
  return withSkeleton(useFetch(request, rest), skeleton);
}
export function useSkeletonLazyFetch(request, opts) {
  const { skeleton, rest } = splitOptions(opts);
  return withSkeleton(useLazyFetch(request, rest), skeleton);
}
export function useSkeletonAsyncData(...args) {
  const last = args[args.length - 1];
  let skeleton = true;
  if (last && typeof last === "object" && !Array.isArray(last) && "skeleton" in last) {
    const opts = last;
    skeleton = opts.skeleton ?? true;
    delete opts.skeleton;
  }
  return withSkeleton(useAsyncData(...args), skeleton);
}
export function useSkeletonLazyAsyncData(...args) {
  const last = args[args.length - 1];
  let skeleton = true;
  if (last && typeof last === "object" && !Array.isArray(last) && "skeleton" in last) {
    const opts = last;
    skeleton = opts.skeleton ?? true;
    delete opts.skeleton;
  }
  return withSkeleton(useLazyAsyncData(...args), skeleton);
}
