import { type PrimitiveLoadingProps } from './useSvgPrimitive.js';
type __VLS_Props = PrimitiveLoadingProps & {
    /** Diameter / side length — number (px) or CSS length. */
    size?: string | number;
    /** Shape. `circle` (default) or `square` (rounded). */
    shape?: 'circle' | 'square';
    /** Border radius when `shape` is `square`. */
    radius?: string | number;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    loading: boolean;
    shimmer: boolean;
    size: string | number;
    animation: import("../../types.js").SkeletonAnimation;
    isLoading: boolean;
    showSkeleton: boolean;
    shape: "circle" | "square";
    radius: string | number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
