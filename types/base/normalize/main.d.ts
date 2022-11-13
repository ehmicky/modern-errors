import type { Plugins } from '../../plugins/shape.js'
import type { AggregateErrors } from '../aggregate.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type {
  AddInstanceAttributes,
  CustomAttributes,
} from '../../subclass/custom/main.js'
import type { ErrorInstance, SpecificErrorInstance } from '../modify/main.js'

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
  : SpecificErrorInstance<
      PluginsArg,
      ErrorPropsArg,
      AddInstanceAttributes<ErrorArg, CustomAttributesArg>,
      AggregateErrorsArg
    >
