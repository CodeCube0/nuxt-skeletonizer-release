import type { ScannedNode, SkeletonAnimationTier, SkeletonizerOptions, SkeletonRuntimeSignals, SkeletonStageTimings, SvgBlueprint } from '../../../types.js';
import { AnimationMicrocontroller } from '../animation/microcontroller.js';
import { BottleneckTracker } from '../devtools/bottleneck.js';
import { ExplainLog } from '../devtools/explain.js';
import { LayoutFingerprintCache } from '../intelligence/fingerprint.js';
import { FpsSampler } from '../perf/fps.js';
import { OffThreadCompute } from '../telemetry/offthread.js';
import { TelemetryCollector } from '../telemetry/telemetry.js';
/**
 * The Layered SVG Engine.
 *
 * One instance per Nuxt app owns every cross-host subsystem and runs the
 * single-backend pipeline for each `<Skeletonizer>` host:
 *
 *   Scan / Classify / Measure (with the blueprint cache)
 *        → SVG Render (one `<svg>` overlay, CLS-clamped viewBox)
 *        → Inject (hide real content, mount overlay — zero layout shift)
 *        → Telemetry & Adaptive Animation (FPS-driven tier feedback).
 *
 * FPS sampling only runs while loading (TAR §1): callers drive
 * {@link SkeletonEngine.setLoading}, and the sampler is alive solely during the
 * skeleton phase and idles at zero cost otherwise — and only when
 * `adaptive`/`telemetry` is enabled.
 */
export interface HostMeta {
    id: number;
    label: string;
    /** Base animation preset used at the `full` tier. */
    animation: string;
    /** Whether shimmer is desired for this scope. */
    shimmer: boolean;
}
export interface HostRenderResult {
    /** SVG shapes drawn. */
    bones: number;
    ignored: number;
    /** Kept named `lastScanMs` to satisfy the existing HostController contract. */
    lastScanMs: number;
    animationTier: SkeletonAnimationTier;
    shimmer: boolean;
    timings: SkeletonStageTimings;
    fromCache: boolean;
    /** The generated blueprint (markup + metadata), for DevTools/cache/scan(). */
    blueprint: SvgBlueprint;
    /** The freshly scanned nodes (empty on a cache hit). */
    nodes: ScannedNode[];
}
export declare class SkeletonEngine {
    private getConfig;
    readonly fps: FpsSampler;
    readonly micro: AnimationMicrocontroller;
    readonly cache: LayoutFingerprintCache;
    readonly telemetry: TelemetryCollector;
    readonly explain: ExplainLog;
    readonly bottleneck: BottleneckTracker;
    readonly offthread: OffThreadCompute;
    /** Mounted overlay per host element, so teardown is exact. */
    private overlays;
    /** The last fingerprint key used per host id (for targeted invalidation). */
    private hostKey;
    private booted;
    private loading;
    /** The route the cache was last keyed against, for route-change eviction. */
    private lastRoute;
    /** Most recent host render result, surfaced as global display stats. */
    lastResult: HostRenderResult | null;
    constructor(getConfig: () => SkeletonizerOptions);
    /** Toggle the loading phase — starts/stops FPS sampling (TAR §1). */
    setLoading(on: boolean): void;
    get isLoading(): boolean;
    /** Build the live runtime signals fed to the score and microcontroller. */
    signals(boneCount: number): SkeletonRuntimeSignals;
    /** Keep mutable subsystems in sync with the (reactive) config each render. */
    private syncConfig;
    /**
     * Run the full SVG pipeline for one host: scan (or replay from cache) → build
     * the `<svg>` blueprint → inject it as an overlay → record telemetry. Returns
     * the figures the store/host surface as live stats.
     */
    renderHost(host: HTMLElement, meta: HostMeta): HostRenderResult;
    /** Hide the host content and mount the SVG overlay (zero CLS). */
    private mountOverlay;
    /** Remove the overlay and restore the host's content visibility. */
    private unmountOverlay;
    /** Whether an overlay is currently mounted on the host. */
    hasOverlay(host: HTMLElement): boolean;
    /** Aggregate, display-facing snapshot for the store stats / DevTools. */
    snapshot(boneCount: number): {
        animationTier: SkeletonAnimationTier;
        score: number;
        fps: number;
        memoryMB: number;
        cacheHits: number;
        cacheMisses: number;
        degraded: boolean;
        timings: SkeletonStageTimings;
    };
    /** Tear down the overlay mounted on a host and forget its cache key. */
    teardownHost(host: HTMLElement, id: number): void;
    /** Invalidate a host's cached blueprint so the next scan rebuilds it. */
    invalidateHost(id: number): void;
    /** The animation preset name to apply for a tier (CSS layer). */
    animationFor(tier: SkeletonAnimationTier, base: string): string;
    /** Stop sampling and release worker/loop resources. */
    dispose(): void;
    /** Empty timings constant (for hosts that never rendered). */
    static get emptyTimings(): SkeletonStageTimings;
    /** Empty blueprint constant (for the initial `scan()` return). */
    static get emptyBlueprint(): SvgBlueprint;
}
