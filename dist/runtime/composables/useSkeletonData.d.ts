import { useFetch } from '#imports';
/**
 * Extra option accepted by the skeleton-aware data composables. When `skeleton`
 * is `true` (the default for these wrappers), the global skeleton turns on while
 * the request is pending and off when it settles — ref-counted so concurrent
 * requests compose correctly.
 */
export interface SkeletonDataExtra {
    skeleton?: boolean;
}
type AsyncDataResult = ReturnType<typeof useFetch>;
/**
 * `useFetch` with skeleton support:
 *
 * ```ts
 * const { data } = await useSkeletonFetch('/api/users', { skeleton: true })
 * ```
 */
export declare function useSkeletonFetch(request: unknown, opts?: Record<string, unknown> & SkeletonDataExtra): AsyncDataResult;
/** `useLazyFetch` with skeleton support. */
export declare function useSkeletonLazyFetch(request: unknown, opts?: Record<string, unknown> & SkeletonDataExtra): AsyncDataResult;
/** `useAsyncData` with skeleton support. */
export declare function useSkeletonAsyncData(...args: [unknown, ...unknown[]]): AsyncDataResult;
/** `useLazyAsyncData` with skeleton support. */
export declare function useSkeletonLazyAsyncData(...args: [unknown, ...unknown[]]): AsyncDataResult;
export {};
