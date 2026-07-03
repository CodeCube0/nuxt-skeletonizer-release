import type { SkeletonAnimation, SkeletonThemeTokens } from '../../types.js';
type __VLS_Props = {
    /** Scope override for the global enabled flag. */
    enabled?: boolean;
    /** Animation preset for this scope (falls back to global config). */
    animation?: SkeletonAnimation;
    /** Whether the shimmer/animation runs (falls back to global config). */
    shimmer?: boolean;
    /** Run the automatic DOM-scan engine (falls back to global config). */
    autoScan?: boolean;
    /** Scoped theme token overrides applied to this host only. */
    theme?: SkeletonThemeTokens;
    /** Wrapper element tag. It hosts the absolutely-positioned SVG overlay. */
    tag?: string;
};
declare function doScan(): void;
declare function restore(): void;
declare var __VLS_9: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_9) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {
    scan: typeof doScan;
    restore: typeof restore;
    active: import("vue").ComputedRef<boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    tag: string;
    shimmer: boolean;
    enabled: boolean;
    autoScan: boolean;
    animation: SkeletonAnimation;
    theme: SkeletonThemeTokens;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
