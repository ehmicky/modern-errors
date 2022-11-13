import type { Cause } from '../options/instance.js'

/**
 * Single aggregate error
 */
type AggregateErrorOption = unknown

/**
 * Aggregate `errors` array
 */
export type AggregateErrors = readonly AggregateErrorOption[]

/**
 * Normalize each error in the `errors` option to `Error` instances
 */
type NormalizeAggregateError<ErrorArg extends AggregateErrorOption> =
  ErrorArg extends Error ? ErrorArg : Error

/**
 * Normalize all errors in the `errors` option to `Error` instances
 */
type NormalizeAggregateErrors<AggregateErrorsArg extends AggregateErrors> =
  AggregateErrorsArg extends never[]
    ? []
    : AggregateErrorsArg extends readonly [
        infer AggregateErrorArg extends AggregateErrorOption,
        ...infer Rest extends AggregateErrors,
      ]
    ? [
        NormalizeAggregateError<AggregateErrorArg>,
        ...NormalizeAggregateErrors<Rest>,
      ]
    : NormalizeAggregateError<AggregateErrorsArg[number]>[]

/**
 * Concatenate the `errors` option with `cause.errors`, if either is defined
 */
type ConcatAggregateErrors<
  AggregateErrorsArg extends AggregateErrors,
  CauseArg extends Cause,
> = AggregateErrorsArg extends AggregateErrors
  ? 'errors' extends keyof CauseArg
    ? CauseArg['errors'] extends AggregateErrors
      ? [...CauseArg['errors'], ...AggregateErrorsArg]
      : AggregateErrorsArg
    : AggregateErrorsArg
  : 'errors' extends keyof CauseArg
  ? CauseArg['errors'] extends AggregateErrors
    ? CauseArg['errors']
    : never
  : never

/**
 * Retrieve the aggregate errors from the `errors` option
 */
export type GetAggregateErrors<
  AggregateErrorsArg extends AggregateErrors,
  CauseArg extends Cause,
> = ConcatAggregateErrors<AggregateErrorsArg, CauseArg> extends never
  ? {}
  : {
      errors: NormalizeAggregateErrors<
        ConcatAggregateErrors<AggregateErrorsArg, CauseArg>
      >
    }
