import type { SkeletonizerOptions, SkeletonThemeTokens } from '../../types.js';
/**
 * Write the resolved configuration onto the document root as CSS variables.
 * Called once on the client when the plugin boots. Safe to call on the server
 * (it no-ops) so SSR doesn't crash.
 */
export declare function applyBaseTheme(config: SkeletonizerOptions): void;
/**
 * Apply theme token overrides at runtime. Targets the document root by default
 * (global theme switch) or a specific element for a scoped theme.
 */
export declare function setThemeTokens(tokens: SkeletonThemeTokens, target?: HTMLElement): void;
/** The CSS variable names, exported for components/tests. */
export declare const THEME_VARS: {
    readonly baseColor: "--sk-base-color";
    readonly highlightColor: "--sk-highlight-color";
    readonly darkBaseColor: "--sk-dark-base-color";
    readonly darkHighlightColor: "--sk-dark-highlight-color";
    readonly borderRadius: "--sk-radius";
    readonly opacity: "--sk-opacity";
    readonly duration: "--sk-duration";
};
