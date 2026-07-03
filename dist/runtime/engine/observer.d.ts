/**
 * A debounced MutationObserver. Coalesces bursts of DOM changes (typical when
 * a framework patches a large subtree) into a single callback so the engine
 * re-scans at most once per `debounce` window.
 */
export declare class DebouncedObserver {
    private observer;
    private timer;
    private readonly debounce;
    private readonly callback;
    constructor(callback: () => void, debounce?: number);
    /** Start observing a root element for child/subtree/attribute changes. */
    observe(root: Element): void;
    /** Temporarily ignore mutations while we mutate the DOM ourselves. */
    pause(): void;
    private schedule;
    /** Stop observing and cancel any pending callback. */
    disconnect(): void;
}
