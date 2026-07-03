import { type ComputedRef, type InjectionKey, type Ref } from 'vue';
import type { ScannedNode, SkeletonAnimation, SkeletonAnimationDefinition, SkeletonAnimationTier, SkeletonizerOptions, SkeletonizerStats, SkeletonStageTimings, SkeletonThemeTokens } from '../types.js';
import { SkeletonEngine } from './engine/pipeline/index.js';
/**
 * Contract every `<Skeletonizer>` host registers with the store, letting the
 * global composable drive re-scans and teardown across all mounted hosts.
 */
export interface HostController {
    id: number;
    /** Re-run the engine scan for this host. */
    scan: () => void;
    /** Restore the host's DOM to its original state. */
    restore: () => void;
    /** Report this host's latest scan figures. */
    report: () => HostReport;
}
/** The result of the most recent `scan()` for a host. */
export interface ScanResult {
    /** Freshly scanned nodes (empty on a cache hit). */
    nodes: ScannedNode[];
    /** The generated `<svg>` overlay markup. */
    svg: string;
    /** Whether the blueprint was served from the cache. */
    cacheHit: boolean;
}
/** A host's latest render figures. */
export interface HostReport {
    bones: number;
    ignored: number;
    lastScanMs: number;
    animationTier?: SkeletonAnimationTier;
    shimmer?: boolean;
    fromCache?: boolean;
    timings?: SkeletonStageTimings;
}
export interface SkeletonizerStore {
    /** The resolved, reactive configuration. */
    config: SkeletonizerOptions;
    /** Manual global enabled flag (overridable per-scope by `<Skeletonizer enabled>`). */
    enabled: Ref<boolean>;
    /** Read-only effective state: manual flag OR any auto-loading in flight. */
    isEnabled: ComputedRef<boolean>;
    /** Number of in-flight skeleton-aware data requests. */
    loadingCount: Ref<number>;
    /** Aggregated, reactive runtime statistics (for DevTools / debugging). */
    stats: SkeletonizerStats;
    enable: () => void;
    disable: () => void;
    toggle: () => boolean;
    /** Increment the auto-loading counter (turns skeleton on while > 0). */
    beginLoading: () => void;
    /** Decrement the auto-loading counter. */
    endLoading: () => void;
    /** Re-scan every mounted host. Alias: `scan`. */
    refresh: () => void;
    /** Re-scan every mounted host and return the most recent blueprint info. */
    scan: () => ScanResult;
    /** Switch theme tokens at runtime (global, unless a target is given). */
    setTheme: (tokens: SkeletonThemeTokens, target?: HTMLElement) => void;
    /** Set the active animation preset globally. */
    setAnimation: (animation: SkeletonAnimation) => void;
    /** Register a custom animation. */
    registerAnimation: (def: SkeletonAnimationDefinition) => void;
    /** The per-app SVG/adaptive engine (cross-host subsystems). */
    engine: SkeletonEngine;
    /** @internal host registry */
    _hosts: Set<HostController>;
    /** @internal */
    _register: (host: HostController) => void;
    /** @internal */
    _unregister: (host: HostController) => void;
    /** @internal recompute aggregated stats from all hosts */
    _recompute: () => void;
    /** @internal monotonic host id source */
    _nextId: () => number;
}
/**
 * Build a fresh store. One instance is created per Nuxt app in the plugin and
 * provided to the component tree — never a module-level singleton, so SSR
 * requests never share state.
 */
export declare function createSkeletonizerStore(config: SkeletonizerOptions): SkeletonizerStore;
/** Injection key for providing the store through the Vue component tree. */
export declare const SKELETONIZER_KEY: InjectionKey<SkeletonizerStore>;
/**
 * Injection key carrying the *effective* enabled state of the nearest enclosing
 * `<Skeletonizer>`. Manual `Skeleton*` primitives read it so that, when dropped
 * inside a `<Skeletonizer>`, they follow that scope's toggle (show their bone
 * while active, reveal their real-content slot when disabled).
 */
export declare const SKELETON_SCOPE_KEY: InjectionKey<ComputedRef<boolean>>;
/** @internal */
export declare function setActiveStore(store: SkeletonizerStore | null): void;
/** @internal */
export declare function getActiveStore(): SkeletonizerStore | null;
