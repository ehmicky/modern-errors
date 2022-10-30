import type { Plugins } from '../plugins/shape.js'
import type { NormalizeError } from './normalize/main.js'
import type { MainInstanceOptions } from '../options/instance.js'
import type { ErrorProps } from '../core_plugins/props/main.js'

/**
 * Single aggregate error
 */
type DefinedAggregateErrorOption = unknown

/**
 * Aggregate `errors`
 */
type DefinedAggregateErrorsOption = readonly DefinedAggregateErrorOption[]

/**
 * Aggregate `errors` option, if defined
 */
export type AggregateErrorsOption = DefinedAggregateErrorsOption | undefined

/**
 * Apply `AnyError.normalize()` on the `errors` option
 */
type NormalizeAggregateErrors<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  AggregateErrorsArg extends AggregateErrorsOption,
> = AggregateErrorsArg extends readonly [
  infer AggregateErrorArg extends DefinedAggregateErrorOption,
  ...infer Rest extends DefinedAggregateErrorsOption,
]
  ? [
      NormalizeError<PluginsArg, ErrorPropsArg, AggregateErrorArg>,
      ...NormalizeAggregateErrors<PluginsArg, ErrorPropsArg, Rest>,
    ]
  : AggregateErrorsArg

/**
 * Concatenate the `errors` option with `cause.errors`, if either is defined
 */
type ConcatAggregateErrors<MainOptionsArg extends MainInstanceOptions> =
  MainOptionsArg['errors'] extends DefinedAggregateErrorsOption
    ? 'errors' extends keyof MainOptionsArg['cause']
      ? MainOptionsArg['cause']['errors'] extends DefinedAggregateErrorsOption
        ? [...MainOptionsArg['cause']['errors'], ...MainOptionsArg['errors']]
        : MainOptionsArg['errors']
      : MainOptionsArg['errors']
    : 'errors' extends keyof MainOptionsArg['cause']
    ? MainOptionsArg['cause']['errors'] extends DefinedAggregateErrorsOption
      ? MainOptionsArg['cause']['errors']
      : AggregateErrorsOption
    : AggregateErrorsOption

/**
 * Retrieve the aggregate errors from the `errors` option
 */
export type GetAggregateErrorsOption<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  MainOptionsArg extends MainInstanceOptions,
> = NormalizeAggregateErrors<
  PluginsArg,
  ErrorPropsArg,
  ConcatAggregateErrors<MainOptionsArg>
>

/**
 * Aggregate errors object to set as `error.errors`, if defined
 */
export type AggregateErrorsProp<
  AggregateErrorsArg extends AggregateErrorsOption,
> = AggregateErrorsArg extends DefinedAggregateErrorsOption
  ? { errors: AggregateErrorsArg }
  : {}
