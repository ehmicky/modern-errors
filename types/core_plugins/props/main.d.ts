import type { OmitKeys } from '../../utils.js'

/**
 * Error properties
 */
export type ErrorProps = object

/**
 * Merge error `props` from the class options and instance options
 */
export type MergeErrorProps<
  PropsOne extends ErrorProps,
  PropsTwo extends ErrorProps,
> = keyof PropsTwo extends never
  ? PropsOne
  : keyof PropsOne & keyof PropsTwo extends never
  ? PropsOne & PropsTwo
  : OmitKeys<PropsOne, keyof PropsTwo> & PropsTwo
