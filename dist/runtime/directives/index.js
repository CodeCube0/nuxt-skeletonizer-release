import { ATTR } from "../constants.js";
function toggleAttr(el, attr, value) {
  if (value === false) {
    el.removeAttribute(attr);
    return;
  }
  el.setAttribute(attr, value === true || value == null ? "" : String(value));
}
function attrDirective(attr) {
  const apply = (el, binding) => {
    toggleAttr(el, attr, binding.value);
  };
  return {
    // Run before children mount so the engine sees the attribute on first scan.
    created: apply,
    mounted: apply,
    updated: apply,
    unmounted(el) {
      el.removeAttribute(attr);
    }
  };
}
export const vSkeletonIgnore = attrDirective(ATTR.ignore);
export const vSkeletonKeep = attrDirective(ATTR.keep);
export const vSkeletonReplace = attrDirective(ATTR.replace);
export const vSkeletonUnion = attrDirective(ATTR.union);
export const vSkeletonShimmer = attrDirective(ATTR.shimmer);
export const directives = {
  "skeleton-ignore": vSkeletonIgnore,
  "skeleton-keep": vSkeletonKeep,
  "skeleton-replace": vSkeletonReplace,
  "skeleton-union": vSkeletonUnion,
  "skeleton-shimmer": vSkeletonShimmer
};
export function registerDirectives(app) {
  for (const [name, directive] of Object.entries(directives)) {
    app.directive(name, directive);
  }
}
