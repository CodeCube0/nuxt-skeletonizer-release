import type { NuxtModule } from '@nuxt/schema'

import type { default as Module } from './module.mjs'

export type ModuleOptions = typeof Module extends NuxtModule<infer O> ? Partial<O> : Record<string, any>

export { default, type defaults } from './module.mjs'

export { type LayoutFingerprint, type ScannedNode, type SkeletonAnimation, type SkeletonAnimationDefinition, type SkeletonAnimationTier, type SkeletonBoneKind, type SkeletonCacheMode, type SkeletonExplainEntry, type SkeletonRect, type SkeletonRenderMode, type SkeletonRuntimeSignals, type SkeletonStageTimings, type SkeletonThemeTokens, type SkeletonizerModuleOptions, type SkeletonizerOptions, type SkeletonizerStats, type SvgBlueprint, type SvgRendererOptions } from './module.mjs'
