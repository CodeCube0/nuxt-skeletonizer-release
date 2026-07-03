import { type PrimitiveLoadingProps } from './useSvgPrimitive.js';
type __VLS_Props = PrimitiveLoadingProps & {
    /** Width — number (px) or CSS length. */
    width?: string | number;
    /** Height — number (px) or CSS length. */
    height?: string | number;
    /** Border radius. */
    radius?: string | number;
    /** Render a full-width button. */
    block?: boolean;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    block: boolean;
    loading: boolean;
    shimmer: boolean;
    animation: import("../../types.js").SkeletonAnimation;
    width: string | number;
    height: string | number;
    isLoading: boolean;
    showSkeleton: boolean;
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
