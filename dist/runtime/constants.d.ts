/**
 * Runtime constants shared by the engine, directives and components.
 */
/** Data attributes written by the directives and read by the scan layer. */
export declare const ATTR: {
    /** Skip this element and its subtree entirely (content kept visible). */
    readonly ignore: "data-skeleton-ignore";
    /** Keep the original content visible inside an otherwise-skeletonized tree. */
    readonly keep: "data-skeleton-keep";
    /** Force a single rect of an (optional) explicit kind for this element. */
    readonly replace: "data-skeleton-replace";
    /** Merge the bounding boxes of elements sharing this group into one rect. */
    readonly union: "data-skeleton-union";
    /** Draw a translucent shimmer over the element, keeping its content visible. */
    readonly shimmer: "data-skeleton-shimmer";
};
/** CSS classes applied by the engine / components. */
export declare const CLASS: {
    /** Host wrapper element of a `<Skeletonizer>`. */
    readonly host: "sk-host";
    /** Host root of a `<Skeletonizer>` in active mode. */
    readonly active: "sk-active";
    /** The absolutely-positioned overlay layer covering the host. */
    readonly overlay: "sk-overlay";
    /** Host whose real content is hidden (kept in layout) under the overlay. */
    readonly svgHidden: "sk-svg-hidden";
    /** The generated `<svg>` element (overlay and inline primitives). */
    readonly svg: "sk-svg";
};
