import { type PrimitiveLoadingProps } from './useSvgPrimitive.js';
type __VLS_Props = PrimitiveLoadingProps & {
    /** Number of text lines. */
    lines?: number;
    /** Line height — number (px) or any CSS length. */
    lineHeight?: string | number;
    /** Gap between lines. */
    gap?: string | number;
    /** Width of the last line (shorter looks natural). */
    lastLineWidth?: string | number;
    /** Width of the block. */
    width?: string | number;
    /** Border radius of each line. */
    radius?: string | number;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    loading: boolean;
    shimmer: boolean;
    gap: string | number;
    animation: import("../../types.js").SkeletonAnimation;
    width: string | number;
    isLoading: boolean;
    showSkeleton: boolean;
    radius: string | number;
    lines: number;
    lineHeight: string | number;
    lastLineWidth: string | number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
