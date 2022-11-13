import type { Plugins } from '../../plugins/shape.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type { CustomAttributes } from '../../subclass/custom/main.js'
import type { ErrorInstance, SpecificErrorInstance } from '../modify/main.js'

/**
 * `ErrorClass.normalize()`.
 */
export type NormalizeError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
  CustomAttributesArg extends CustomAttributes,
> = ErrorArg extends ErrorInstance<PluginsArg>
  ? ErrorArg
  : SpecificErrorInstance<
      PluginsArg,
      ErrorPropsArg,
      CustomAttributesArg,
      ErrorArg,
      never
    >
