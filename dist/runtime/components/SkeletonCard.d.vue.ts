import { type PrimitiveLoadingProps } from './useSvgPrimitive.js';
type __VLS_Props = PrimitiveLoadingProps & {
    /** Show a media image at the top of the card. */
    media?: boolean;
    /** Show an avatar + title header row. */
    avatar?: boolean;
    /** Show a footer action button. */
    footer?: boolean;
    /** Number of body text lines. */
    lines?: number;
    /** Card width. */
    width?: string | number;
    /** Card padding. */
    padding?: string | number;
    /** Card border radius (applied to the media banner). */
    radius?: string | number;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    avatar: boolean;
    footer: boolean;
    loading: boolean;
    shimmer: boolean;
    animation: import("../../types.js").SkeletonAnimation;
    width: string | number;
    padding: string | number;
    isLoading: boolean;
    showSkeleton: boolean;
    radius: string | number;
    media: boolean;
    lines: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
