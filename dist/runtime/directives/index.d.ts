import type { App, Directive } from 'vue';
/** `v-skeleton-ignore` — exclude the element and its subtree from skeletonization. */
export declare const vSkeletonIgnore: Directive<HTMLElement, unknown>;
/** `v-skeleton-keep` — keep the original content visible inside a skeleton tree. */
export declare const vSkeletonKeep: Directive<HTMLElement, unknown>;
/** `v-skeleton-replace` — force a bone of an (optional) explicit kind. */
export declare const vSkeletonReplace: Directive<HTMLElement, unknown>;
/** `v-skeleton-union` — collapse the element and its subtree into one bone. */
export declare const vSkeletonUnion: Directive<HTMLElement, unknown>;
/** `v-skeleton-shimmer` — apply only the shimmer overlay, keep content. */
export declare const vSkeletonShimmer: Directive<HTMLElement, unknown>;
/** Map of directive name (without the `v-` prefix) → definition. */
export declare const directives: Record<string, Directive<HTMLElement, unknown>>;
/** Register every skeleton directive on a Vue app. */
export declare function registerDirectives(app: App): void;
