export const ATTR = {
  /** Skip this element and its subtree entirely (content kept visible). */
  ignore: "data-skeleton-ignore",
  /** Keep the original content visible inside an otherwise-skeletonized tree. */
  keep: "data-skeleton-keep",
  /** Force a single rect of an (optional) explicit kind for this element. */
  replace: "data-skeleton-replace",
  /** Merge the bounding boxes of elements sharing this group into one rect. */
  union: "data-skeleton-union",
  /** Draw a translucent shimmer over the element, keeping its content visible. */
  shimmer: "data-skeleton-shimmer"
};
export const CLASS = {
  /** Host wrapper element of a `<Skeletonizer>`. */
  host: "sk-host",
  /** Host root of a `<Skeletonizer>` in active mode. */
  active: "sk-active",
  /** The absolutely-positioned overlay layer covering the host. */
  overlay: "sk-overlay",
  /** Host whose real content is hidden (kept in layout) under the overlay. */
  svgHidden: "sk-svg-hidden",
  /** The generated `<svg>` element (overlay and inline primitives). */
  svg: "sk-svg"
};
