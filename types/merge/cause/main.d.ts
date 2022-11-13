import type { Cause, NormalizedCause } from '../../options/instance.js'
import type { ErrorProps } from '../../plugins/core/props/main.js'
import type { PluginsInstanceMethods } from '../../plugins/instance.js'
import type { PluginsProperties } from '../../plugins/properties.js'
import type { Plugins } from '../../plugins/shape.js'
import type { CustomClass } from '../../subclass/custom/main.js'
import type { SetProps } from '../../utils.js'
import type { AggregateErrors, GetAggregateErrors } from '../aggregate.js'

/**
 * Error instance object, used internally with additional generics.
 * This mixes: `Error`, aggregate errors, plugin instance methods,
 * `plugin.properties()` and `props`, while ensuring those do not overlap each
 * other.
 */
export type SpecificErrorInstance<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomClassArg extends CustomClass,
  AggregateErrorsArg extends AggregateErrors,
  CauseArg extends Cause,
> = SetProps<
  NormalizedCause<CauseArg>,
  SetProps<
    ErrorPropsArg,
    SetProps<
      PluginsProperties<PluginsArg>,
      SetProps<
        PluginsInstanceMethods<PluginsArg>,
        SetProps<
          GetAggregateErrors<AggregateErrorsArg, CauseArg>,
          InstanceType<CustomClassArg>
        >
      >
    >
  >
>

/**
 * Error instance object
 */
export type ErrorInstance<PluginsArg extends Plugins = []> =
  SpecificErrorInstance<
    PluginsArg,
    ErrorProps,
    CustomClass,
    AggregateErrors,
    Cause
  >
