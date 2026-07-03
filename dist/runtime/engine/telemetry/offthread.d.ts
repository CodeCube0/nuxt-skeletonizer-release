/**
 * Off-Threading (Step 3 §6 TAR).
 *
 * Heavy compute — fingerprint hashing over huge node lists, "Huge Pages"
 * structural analysis, telemetry roll-ups — must never block the main thread.
 * This module delegates such work to a dedicated Web Worker created from an
 * inline Blob (no separate asset to ship). When workers are unavailable (SSR,
 * tests, locked-down CSP), it transparently falls back to `requestIdleCallback`
 * so the work is still fragmented off the critical path.
 */
export type OffThreadTask = {
    type: 'fingerprint';
    payload: string;
} | {
    type: 'analyze';
    payload: number[];
};
export interface AnalyzeResult {
    count: number;
    sum: number;
    mean: number;
    max: number;
    /** Estimated cost class for a "huge page": 'light' | 'heavy' | 'extreme'. */
    pageClass: 'light' | 'heavy' | 'extreme';
}
export declare class OffThreadCompute {
    private preferWorker;
    private worker;
    private seq;
    private pending;
    private workerOk;
    constructor(preferWorker?: boolean);
    /** Lazily create the worker on first use. */
    private ensureWorker;
    /** Run a task off the main thread (worker → idle fallback). */
    run<T = unknown>(task: OffThreadTask): Promise<T>;
    /** Whether a real worker is backing this instance. */
    get usingWorker(): boolean;
    dispose(): void;
}
/** The synchronous main-thread implementation, shared as the idle fallback. */
export declare function runOnMain(task: OffThreadTask): string | AnalyzeResult;
