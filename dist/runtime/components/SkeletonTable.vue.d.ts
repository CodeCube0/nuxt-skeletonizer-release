import { type PrimitiveLoadingProps } from './useSvgPrimitive.js';
type __VLS_Props = PrimitiveLoadingProps & {
    /** Number of body rows. */
    rows?: number;
    /** Number of columns. */
    columns?: number;
    /** Render a header row. */
    header?: boolean;
    /** Gap between rows (vertical). */
    gap?: string | number;
    /** Height of a body cell. */
    cellHeight?: string | number;
    /** Height of a header cell. */
    headerHeight?: string | number;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    header: boolean;
    loading: boolean;
    shimmer: boolean;
    gap: string | number;
    animation: import("../../types.js").SkeletonAnimation;
    isLoading: boolean;
    showSkeleton: boolean;
    columns: number;
    rows: number;
    cellHeight: string | number;
    headerHeight: string | number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
