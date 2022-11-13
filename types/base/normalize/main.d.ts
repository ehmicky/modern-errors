import type { Plugins } from '../../plugins/shape.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type { ErrorConstructor } from '../../subclass/parent/main.js'
import type { ErrorInstance, SpecificErrorInstance } from '../modify/main.js'

/**
 * `ErrorClass.normalize()`.
 */
export type NormalizeError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
  CustomClass extends ErrorConstructor,
> = ErrorArg extends ErrorInstance<PluginsArg>
  ? ErrorArg
  : SpecificErrorInstance<
      PluginsArg,
      ErrorPropsArg,
      CustomClass,
      undefined,
      ErrorArg
    >
