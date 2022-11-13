import type { Plugins } from '../../plugins/shape.js'
import type { AggregateErrors } from '../aggregate.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type {
  CustomInstanceAttributes,
  CustomAttributes,
} from '../../subclass/custom/main.js'
import type { ErrorInstance, SpecificErrorInstance } from '../modify/main.js'

/**
 * Return value of `new ErrorClass()` or `ErrorClass.normalize()`.
 */
export type BaseErrorInstance<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
  CustomAttributesArg extends CustomAttributes,
  AggregateErrorsArg extends AggregateErrors,
> = SpecificErrorInstance<
  PluginsArg,
  ErrorPropsArg,
  CustomAttributesArg &
    Omit<CustomInstanceAttributes<Error, ErrorArg>, keyof CustomAttributesArg>,
  AggregateErrorsArg
>

/**
 * `ErrorClass.normalize()`.
 */
export type NormalizeError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
  CustomAttributesArg extends CustomAttributes,
  AggregateErrorsArg extends AggregateErrors,
> = ErrorArg extends ErrorInstance<PluginsArg>
  ? ErrorArg
  : BaseErrorInstance<
      PluginsArg,
      ErrorPropsArg,
      ErrorArg,
      CustomAttributesArg,
      AggregateErrorsArg
    >
