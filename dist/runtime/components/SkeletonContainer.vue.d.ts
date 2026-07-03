/**
 * A layout primitive for arranging skeleton bones in a flex or grid. It owns
 * no engine logic — it simply preserves spacing so composed skeletons line up
 * with the real layout they stand in for.
 */
type __VLS_Props = {
    /** Layout mode. */
    layout?: 'flex' | 'grid';
    /** Flex direction (when `layout` is `flex`). */
    direction?: 'row' | 'column';
    /** Number of columns (when `layout` is `grid`). */
    columns?: number;
    /** Gap between children. */
    gap?: string | number;
    /** Wrap flex children. */
    wrap?: boolean;
    /** align-items value. */
    align?: string;
    /** justify-content value. */
    justify?: string;
    /** Wrapper width. */
    width?: string | number;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    justify: string;
    align: string;
    gap: string | number;
    direction: "row" | "column";
    width: string | number;
    layout: "flex" | "grid";
    wrap: boolean;
    columns: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
