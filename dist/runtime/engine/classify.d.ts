import type { SkeletonBoneKind } from '../../types.js';
/**
 * The result of inspecting a single element.
 *
 * - a `SkeletonBoneKind` → paint this element as a leaf bone, do not descend
 * - `'container'`        → leave untouched, descend into children
 * - `'skip'`             → leave untouched, do not descend (ignored subtree)
 * - `'shimmer'`          → apply shimmer overlay only, descend into children
 */
export type Classification = SkeletonBoneKind | 'container' | 'skip' | 'shimmer';
/**
 * Classify an element into a skeleton treatment. Directive attributes always
 * win over heuristics so authors can override the engine precisely.
 */
export declare function classify(el: HTMLElement, style: CSSStyleDeclaration): Classification;
