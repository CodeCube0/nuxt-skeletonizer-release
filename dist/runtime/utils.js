import { inject } from "vue";
import { getActiveStore, SKELETONIZER_KEY } from "./state.js";
export function cssSize(value) {
  if (value === void 0 || value === null) return void 0;
  return typeof value === "number" ? `${value}px` : value;
}
export function pxSize(value, fallback = 0) {
  if (value === void 0 || value === null) return fallback;
  if (typeof value === "number") return value;
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return fallback;
  if (value.includes("%")) return fallback;
  if (value.includes("rem") || value.includes("em")) return n * 16;
  return n;
}
export function svgWidthValue(value, fallback = "100%") {
  if (value === void 0 || value === null) return fallback;
  if (typeof value === "number") return `${value}px`;
  return value;
}
export function useSkeletonStore() {
  return inject(SKELETONIZER_KEY, null) ?? getActiveStore();
}
