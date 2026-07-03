import { type ComputedRef } from 'vue';
import type { SkeletonAnimation, SkeletonAnimationDefinition, SkeletonizerOptions, SkeletonizerStats, SkeletonThemeTokens } from '../../types.js';
import type { SkeletonEngine } from '../engine/pipeline/index.js';
import { type ScanResult } from '../state.js';
/**
 * Public surface of the composable. Mirrors the spec:
 *
 * ```ts
 * const s = useSkeletonizer()
 * s.enable(); s.disable(); s.toggle()
 * s.isEnabled; s.config
 * s.refresh(); s.scan()
 * ```
 */
export interface UseSkeletonizerReturn {
    /** Turn skeleton mode on globally. */
    enable: () => void;
    /** Turn skeleton mode off globally. */
    disable: () => void;
    /** Flip skeleton mode; returns the new state. */
    toggle: () => boolean;
    /** Reactive, read-only enabled state. */
    isEnabled: ComputedRef<boolean>;
    /** The resolved, reactive configuration (incl. read-only `renderMode: 'svg'`). */
    config: SkeletonizerOptions;
    /** Re-scan all mounted hosts (rebuild the SVG overlays). */
    refresh: () => void;
    /** Re-scan all hosts; returns `{ nodes, svg, cacheHit }` for the latest host. */
    scan: () => ScanResult;
    /** Reactive runtime statistics. */
    stats: SkeletonizerStats;
    /** Switch theme tokens at runtime. */
    setTheme: (tokens: SkeletonThemeTokens, target?: HTMLElement) => void;
    /** Set the active animation preset. */
    setAnimation: (animation: SkeletonAnimation) => void;
    /** Register a custom animation. */
    registerAnimation: (def: SkeletonAnimationDefinition) => void;
    /** The per-app SVG/adaptive engine (advanced/DevTools access). */
    engine: SkeletonEngine;
}
/**
 * Access and control the skeletonizer. Works globally, per page, per component
 * and per container (any scope can call `enable`/`disable`/`refresh`).
 */
export declare function useSkeletonizer(): UseSkeletonizerReturn;
