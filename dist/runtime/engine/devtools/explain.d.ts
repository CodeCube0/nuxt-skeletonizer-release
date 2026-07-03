import type { SkeletonExplainEntry } from '../../../types.js';
/**
 * Explain Mode (Step 3 §7).
 *
 * A ring buffer of natural-language explanations of the decisions the runtime
 * engine takes — cache hits, animation degradations, shimmer auto-disable.
 * DevTools and the docs surface these verbatim, e.g.
 *   "Blueprint SVG servito dalla cache — scansione saltata."
 *
 * Kept allocation-light and SSR-safe: timestamps are supplied by the caller.
 */
export declare class ExplainLog {
    private capacity;
    private enabled;
    private entries;
    private seq;
    private subscribers;
    constructor(capacity?: number, enabled?: boolean);
    setEnabled(on: boolean): void;
    get isEnabled(): boolean;
    /** Append an explanation. No-op while disabled (zero overhead). */
    push(code: string, message: string, at: number): SkeletonExplainEntry | null;
    /** Most recent entries (oldest → newest). */
    list(): readonly SkeletonExplainEntry[];
    /** The single most recent entry, if any. */
    latest(): SkeletonExplainEntry | null;
    subscribe(fn: (e: SkeletonExplainEntry) => void): () => void;
    clear(): void;
}
/**
 * Compose a standard explanation message from a decision code + signals so the
 * phrasing is consistent across the engine.
 */
export declare function explainDecision(code: string, detail: Record<string, string | number>): string;
