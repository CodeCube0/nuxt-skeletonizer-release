import { type CSSProperties, type PropType, type VNode } from 'vue';
import type { SvgShape, SvgVisualMode } from './useSvgPrimitive.js';
/**
 * Internal helper that renders one inline `<svg>` for the manual primitives:
 * the shared, namespaced shimmer gradient plus a list of `<rect>`/`<circle>`
 * shapes filled by it. Not a public component — imported directly by the
 * `Skeleton*` primitives so they all emit identical, SSR-safe SVG markup.
 *
 * Authored as a render function (rather than an SFC template) on purpose: the
 * SVG sub-tree is built with `h('svg', …)`, which Vue resolves into the SVG
 * namespace automatically. This sidesteps the template compiler entirely, so it
 * compiles identically across every bundler (Vite, Rollup and rolldown-vite —
 * the latter's template parser chokes on inline SVG).
 */
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    width: {
        type: PropType<string | number | undefined>;
        default: undefined;
    };
    height: {
        type: PropType<string | number | undefined>;
        default: undefined;
    };
    mode: {
        type: PropType<SvgVisualMode>;
        required: true;
    };
    gradId: {
        type: StringConstructor;
        required: true;
    };
    fill: {
        type: StringConstructor;
        required: true;
    };
    durSec: {
        type: StringConstructor;
        required: true;
    };
    shapes: {
        type: PropType<SvgShape[]>;
        required: true;
    };
    svgStyle: {
        type: PropType<CSSProperties>;
        default: undefined;
    };
}>, () => VNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    width: {
        type: PropType<string | number | undefined>;
        default: undefined;
    };
    height: {
        type: PropType<string | number | undefined>;
        default: undefined;
    };
    mode: {
        type: PropType<SvgVisualMode>;
        required: true;
    };
    gradId: {
        type: StringConstructor;
        required: true;
    };
    fill: {
        type: StringConstructor;
        required: true;
    };
    durSec: {
        type: StringConstructor;
        required: true;
    };
    shapes: {
        type: PropType<SvgShape[]>;
        required: true;
    };
    svgStyle: {
        type: PropType<CSSProperties>;
        default: undefined;
    };
}>> & Readonly<{}>, {
    width: string | number | undefined;
    height: string | number | undefined;
    svgStyle: CSSProperties;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
