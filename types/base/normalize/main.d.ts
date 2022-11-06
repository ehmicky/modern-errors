import type { Plugins } from '../../plugins/shape.js'
import type { GetAggregateErrors } from '../aggregate.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type { CustomInstanceAttributes } from '../../subclass/custom/main.js'
import type { MainInstanceOptions } from '../../options/instance.js'
import type { ErrorInstance, BaseError } from '../modify/main.js'

/**
 * Return value of `new BaseError()` or `BaseError.normalize()`.
 */
export type BaseErrorInstance<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
  MainInstanceOptionsArg extends MainInstanceOptions,
> = BaseError<
  PluginsArg,
  ErrorPropsArg,
  CustomInstanceAttributes<Error, ErrorArg>,
  GetAggregateErrors<MainInstanceOptionsArg>
>

/**
 * `BaseError.normalize()`.
 */
export type NormalizeError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
> = ErrorArg extends ErrorInstance<PluginsArg>
  ? ErrorArg
  : BaseErrorInstance<PluginsArg, ErrorPropsArg, ErrorArg, MainInstanceOptions>
