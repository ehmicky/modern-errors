import type { Plugins } from '../plugins/shape.js'
import type { NormalizeError } from './normalize/main.js'
import type { MainInstanceOptions } from '../options/instance.js'
import type { ErrorProps } from '../core_plugins/props/main.js'

/**
 * Single aggregate error
 */
type AggregateErrorOption = unknown

/**
 * Aggregate `errors` array
 */
type AggregateErrorsArray = readonly AggregateErrorOption[]

/**
 * Aggregate `errors` object
 */
export interface AggregateErrors {
  /**
   * The `errors` option aggregates multiple errors into one. This is like
   * [`new AggregateError(errors)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError/AggregateError)
   * except that it works with any error class.
   *
   * @example
   * ```js
   * const databaseError = new DatabaseError('...')
   * const authError = new AuthError('...')
   * throw new InputError('...', { errors: [databaseError, authError] })
   * // InputError: ... {
   * //   [errors]: [
   * //     DatabaseError: ...
   * //     AuthError: ...
   * //   ]
   * // }
   * ```
   */
  readonly errors?: AggregateErrorsArray
}

/**
 * Apply `AnyError.normalize()` on the `errors` option
 */
type NormalizeAggregateErrors<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  AggregateErrorsArg extends AggregateErrorsArray,
> = AggregateErrorsArg extends never[]
  ? []
  : AggregateErrorsArg extends readonly [
      infer AggregateErrorArg extends AggregateErrorOption,
      ...infer Rest extends AggregateErrorsArray,
    ]
  ? [
      NormalizeError<PluginsArg, ErrorPropsArg, AggregateErrorArg>,
      ...NormalizeAggregateErrors<PluginsArg, ErrorPropsArg, Rest>,
    ]
  : NormalizeError<PluginsArg, ErrorPropsArg, AggregateErrorsArg[number]>[]

/**
 * Concatenate the `errors` option with `cause.errors`, if either is defined
 */
type ConcatAggregateErrors<MainInstanceOptionsArg extends MainInstanceOptions> =
  MainInstanceOptionsArg['errors'] extends AggregateErrorsArray
    ? 'errors' extends keyof MainInstanceOptionsArg['cause']
      ? MainInstanceOptionsArg['cause']['errors'] extends AggregateErrorsArray
        ? [
            ...MainInstanceOptionsArg['cause']['errors'],
            ...MainInstanceOptionsArg['errors'],
          ]
        : MainInstanceOptionsArg['errors']
      : MainInstanceOptionsArg['errors']
    : 'errors' extends keyof MainInstanceOptionsArg['cause']
    ? MainInstanceOptionsArg['cause']['errors'] extends AggregateErrorsArray
      ? MainInstanceOptionsArg['cause']['errors']
      : never
    : never

/**
 * Retrieve the aggregate errors from the `errors` option
 */
export type GetAggregateErrors<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  MainInstanceOptionsArg extends MainInstanceOptions,
> = ConcatAggregateErrors<MainInstanceOptionsArg> extends never
  ? {}
  : {
      errors: NormalizeAggregateErrors<
        PluginsArg,
        ErrorPropsArg,
        ConcatAggregateErrors<MainInstanceOptionsArg>
      >
    }
