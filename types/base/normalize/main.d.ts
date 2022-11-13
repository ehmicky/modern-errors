import type { Plugins } from '../../plugins/shape.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type { CustomClass } from '../../subclass/parent/main.js'
import type { SpecificErrorClass } from '../../subclass/main/main.js'
import type { SetProps } from '../../utils.js'

/**
 * `ErrorClass.normalize()`.
 */
export type NormalizeError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomClassArg extends CustomClass,
> = <
  ErrorArg extends unknown,
  UnknownErrorClass extends SpecificErrorClass<
    PluginsArg,
    ErrorPropsArg,
    CustomClassArg
  > = SpecificErrorClass<PluginsArg, ErrorPropsArg, CustomClassArg>,
>(
  error: ErrorArg,
  UnknownErrorClass?: UnknownErrorClass,
) => ErrorArg extends InstanceType<
  SpecificErrorClass<PluginsArg, ErrorPropsArg, CustomClassArg>
>
  ? ErrorArg
  : ErrorArg extends Error
  ? SetProps<ErrorArg, InstanceType<UnknownErrorClass>>
  : InstanceType<UnknownErrorClass>
