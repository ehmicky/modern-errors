import type { Plugins } from '../../plugins/shape.js'
import type { AggregateErrors } from '../aggregate.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type { CustomInstanceAttributes } from '../../subclass/custom/main.js'
import type { ErrorInstance, BaseError } from '../modify/main.js'

/**
 * Return value of `new BaseError()` or `BaseError.normalize()`.
 */
export type BaseErrorInstance<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
  AggregateErrorsArg extends AggregateErrors,
> = BaseError<
  PluginsArg,
  ErrorPropsArg,
  CustomInstanceAttributes<Error, ErrorArg>,
  AggregateErrorsArg
>

/**
 * `BaseError.normalize()`.
 */
export type NormalizeError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
  AggregateErrorsArg extends AggregateErrors,
> = ErrorArg extends ErrorInstance<PluginsArg>
  ? ErrorArg
  : BaseErrorInstance<PluginsArg, ErrorPropsArg, ErrorArg, AggregateErrorsArg>
