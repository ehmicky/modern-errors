import type { Cause, NormalizedCause } from '../options/instance.js'
import type { ErrorProps } from '../plugins/core/props/main.js'
import type { PluginsInstanceMethods } from '../plugins/instance/call.js'
import type { PluginsProperties } from '../plugins/properties/main.js'
import type { Plugins } from '../plugins/shape/main.js'
import type { CustomClass } from '../subclass/custom.js'
import type { SetProps } from '../utils/omit.js'
import type { AggregateErrors, AggregateErrorsProperty } from './aggregate.js'

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
          AggregateErrorsProperty<AggregateErrorsArg, CauseArg>,
          InstanceType<CustomClassArg>
        >
      >
    >
  >
>

/**
 * Error instance object
 */
export type ErrorInstance<PluginsArg extends Plugins = Plugins> =
  SpecificErrorInstance<
    PluginsArg,
    ErrorProps,
    CustomClass,
    AggregateErrors,
    Cause
  >
