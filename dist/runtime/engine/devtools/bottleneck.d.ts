/**
 * Overlay Debugger & Bottleneck Detection (Step 3 §7).
 *
 * Tracks per-host scan/render cost so DevTools can rank the components that are
 * slowest to skeletonize, and can paint a debug overlay mapping bones on the
 * page. Cost is accumulated with a running mean so a single janky frame doesn't
 * dominate the ranking.
 */
export interface HostCost {
    id: number;
    label: string;
    /** Running-mean scan time (ms). */
    scanMs: number;
    /** Running-mean render time (ms). */
    renderMs: number;
    /** Bones in the latest plan. */
    bones: number;
    /** Number of samples folded into the means. */
    samples: number;
}
export declare class BottleneckTracker {
    private hosts;
    /** Fold a sample for a host into its running means. */
    record(id: number, label: string, scanMs: number, renderMs: number, bones: number): void;
    /** Drop a host that has unmounted. */
    forget(id: number): void;
    /** Hosts ranked by total (scan+render) cost, slowest first. */
    ranked(): HostCost[];
    /** The single worst offender, if any. */
    worst(): HostCost | null;
    clear(): void;
}
