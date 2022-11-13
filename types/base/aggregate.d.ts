import type { Cause } from '../options/instance.js'

/**
 * Single aggregate error
 */
type AggregateErrorOption = unknown

/**
 * Aggregate `errors` array
 */
type DefinedAggregateErrors = readonly AggregateErrorOption[]

/**
 * Optional aggregate `errors` array
 */
export type AggregateErrors = DefinedAggregateErrors | undefined

/**
 * Normalize each error in the `errors` option to `Error` instances
 */
type NormalizeAggregateError<ErrorArg extends AggregateErrorOption> =
  ErrorArg extends Error ? ErrorArg : Error

/**
 * Normalize all errors in the `errors` option to `Error` instances
 */
type NormalizeAggregateErrors<
  AggregateErrorsArg extends DefinedAggregateErrors,
> = AggregateErrorsArg extends never[]
  ? []
  : AggregateErrorsArg extends readonly [
      infer AggregateErrorArg extends AggregateErrorOption,
      ...infer Rest extends DefinedAggregateErrors,
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
> = [AggregateErrorsArg] extends [DefinedAggregateErrors]
  ? 'errors' extends keyof CauseArg
    ? CauseArg['errors'] extends DefinedAggregateErrors
      ? [...CauseArg['errors'], ...AggregateErrorsArg]
      : AggregateErrorsArg
    : AggregateErrorsArg
  : 'errors' extends keyof CauseArg
  ? CauseArg['errors'] extends DefinedAggregateErrors
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
