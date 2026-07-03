import type { SkeletonAnimationDefinition } from '../../types.js';
/** The built-in animation presets shipped in the core stylesheet. */
export declare const BUILTIN_ANIMATIONS: readonly ["wave", "pulse", "fade", "gradient", "shine", "none"];
/**
 * Register a custom animation at runtime. The provided CSS (keyframes + rules)
 * is injected once; referencing `animation: '<name>'` then activates it. Rules
 * should be scoped under `.sk-anim-<name> .sk-bone` to match the host pattern.
 */
export declare function registerAnimation(def: SkeletonAnimationDefinition): void;
/** Whether an animation name is known (built-in or registered). */
export declare function hasAnimation(name: string): boolean;
/** Names of all registered custom animations. */
export declare function customAnimationNames(): string[];
/** The class that names a given animation preset, e.g. `sk-anim-wave`. */
export declare function animationClass(name: string): string;
/** Reset registered animations — used by tests. */
export declare function __resetAnimations(): void;
