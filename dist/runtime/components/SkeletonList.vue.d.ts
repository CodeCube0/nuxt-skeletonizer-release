import { type PrimitiveLoadingProps } from './useSvgPrimitive.js';
type __VLS_Props = PrimitiveLoadingProps & {
    /** Number of list rows. */
    items?: number;
    /** Show a leading avatar on each row. */
    avatar?: boolean;
    /** Number of text lines per row. */
    lines?: number;
    /** Gap between rows. */
    gap?: string | number;
    /** Avatar size. */
    avatarSize?: string | number;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    avatar: boolean;
    loading: boolean;
    shimmer: boolean;
    gap: string | number;
    animation: import("../../types.js").SkeletonAnimation;
    isLoading: boolean;
    showSkeleton: boolean;
    lines: number;
    items: number;
    avatarSize: string | number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
