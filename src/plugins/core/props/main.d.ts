import type { SimpleSetProps } from '../../../utils/omit.js'

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
> = SimpleSetProps<PropsOne, PropsTwo>
