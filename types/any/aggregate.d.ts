import type { Plugins } from '../plugins/shape.js'
import type { NormalizeError } from './normalize/main.js'
import type { MainInstanceOptions } from '../options/instance.js'
import type { ErrorProps } from '../core_plugins/props/main.js'

/**
 * Single aggregate error
 */
type AggregateErrorOption = unknown

/**
 * Aggregate `errors` option
 */
export type AggregateErrorsOption = readonly AggregateErrorOption[]

/**
 * Aggregate errors object set to `error`
 */
export interface AggregateErrors {
  readonly errors?: AggregateErrorsOption
}

/**
 * Apply `AnyError.normalize()` on the `errors` option
 */
type NormalizeAggregateErrors<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  AggregateErrorsArg extends AggregateErrorsOption,
> = AggregateErrorsArg extends readonly [
  infer AggregateErrorArg extends AggregateErrorOption,
  ...infer Rest extends AggregateErrorsOption,
]
  ? [
      NormalizeError<PluginsArg, ErrorPropsArg, AggregateErrorArg>,
      ...NormalizeAggregateErrors<PluginsArg, ErrorPropsArg, Rest>,
    ]
  : AggregateErrorsArg

/**
 * Concatenate the `errors` option with `cause.errors`, if either is defined
 */
type ConcatAggregateErrors<MainInstanceOptionsArg extends MainInstanceOptions> =
  MainInstanceOptionsArg['errors'] extends AggregateErrorsOption
    ? 'errors' extends keyof MainInstanceOptionsArg['cause']
      ? MainInstanceOptionsArg['cause']['errors'] extends AggregateErrorsOption
        ? [
            ...MainInstanceOptionsArg['cause']['errors'],
            ...MainInstanceOptionsArg['errors'],
          ]
        : MainInstanceOptionsArg['errors']
      : MainInstanceOptionsArg['errors']
    : 'errors' extends keyof MainInstanceOptionsArg['cause']
    ? MainInstanceOptionsArg['cause']['errors'] extends AggregateErrorsOption
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
