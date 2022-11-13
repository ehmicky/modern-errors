import type { Plugins } from '../../plugins/shape.js'
import type { PluginsInstanceMethods } from '../../plugins/instance.js'
import type { Cause, NormalizedCause } from '../../options/instance.js'
import type { PluginsProperties } from '../../plugins/properties.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type { AggregateErrors, GetAggregateErrors } from '../aggregate.js'
import type { ErrorConstructor } from '../../subclass/parent/main.js'
import type { SetProps } from '../../utils.js'

/**
 * Error instance object, used internally with additional generics.
 * This mixes: `Error`, aggregate errors, plugin instance methods,
 * `plugin.properties()` and `props`, while ensuring those do not overlap each
 * other.
 */
export type SpecificErrorInstance<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomClass extends ErrorConstructor,
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
          InstanceType<CustomClass>
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
    ErrorConstructor,
    AggregateErrors,
    Cause
  >
