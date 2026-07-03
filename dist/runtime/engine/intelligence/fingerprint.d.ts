import type { LayoutFingerprint, SkeletonCacheMode, SvgBlueprint } from '../../../types.js';
/**
 * Layout Fingerprinting & Blueprint Cache.
 *
 * A layout fingerprint is a cheap, dependency-free hash of a host's identity:
 * `routePath + viewport(bucketed) + componentUID`. Two renders of the same
 * component at the same route and viewport produce the same fingerprint,
 * letting the engine skip the scan/measure/render pipeline entirely and replay
 * a cached {@link SvgBlueprint}.
 *
 * Storage is in-memory (always) with an optional `sessionStorage` mirror so a
 * blueprint survives a soft navigation. The hash uses FNV-1a — tiny, fast, and
 * good enough for cache keys; it is shared with the off-thread worker.
 */
/** FNV-1a 32-bit hash — tiny, dependency-free, good enough for cache keys. */
export declare function fnv1a(input: string): string;
/** Bucket a viewport dimension so near-identical sizes share a fingerprint. */
export declare function bucket(value: number, step?: number): number;
/** Compute the layout fingerprint for a host. */
export declare function layoutFingerprint(route: string, viewport: {
    width: number;
    height: number;
}, uid: string): LayoutFingerprint;
export declare class LayoutFingerprintCache {
    private mode;
    private maxEntries;
    private mem;
    private hits;
    private misses;
    constructor(mode?: SkeletonCacheMode, maxEntries?: number);
    get enabled(): boolean;
    get stats(): {
        hits: number;
        misses: number;
    };
    /** Look up a cached blueprint by key, counting hits/misses. */
    get(key: string): SvgBlueprint | null;
    /** Store a blueprint, evicting the oldest entry when over capacity (LRU-ish). */
    set(fingerprint: LayoutFingerprint, blueprint: SvgBlueprint, storedAt: number): void;
    /** Drop a single entry by key (e.g. when a host's content changes). */
    invalidate(key: string): void;
    /** Drop every entry stored for a route (route-change invalidation). */
    invalidateRoute(route: string): void;
    /** Drop everything (both tiers). */
    clear(): void;
    private readSession;
    private writeSession;
}
