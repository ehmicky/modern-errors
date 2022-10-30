import type { Plugins } from '../../plugins/shape.js'
import type { PluginsInstanceMethods } from '../../plugins/instance.js'
import type { PluginsProperties } from '../../plugins/properties.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type { CustomAttributes } from '../../subclass/custom/main.js'
import type { Intersect } from '../../utils.js'
import type {
  AggregateErrorsOption,
  AggregateErrorsProp,
} from '../aggregate.js'

/**
 * Core `Error` properties which cannot be redefined by `plugin.properties()`,
 * `props`, instance methods or the `custom` option
 */
type CoreErrorProps = keyof Error | 'errors'

/**
 * Core `Error` properties which cannot be redefined by `plugin.properties()`
 * or `props`
 */
type ConstErrorProps = Exclude<CoreErrorProps, 'message' | 'stack'>

/**
 * Error instance object, used internally with additional generics.
 * This mixes: `Error`, aggregate errors, plugin instance methods,
 * `plugin.properties()` and `props`, while ensuring those do not overlap each
 * other.
 */
export type BaseError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomAttributesArg extends CustomAttributes,
  AggregateErrorsArg extends AggregateErrorsOption,
> = Intersect<
  Intersect<
    Intersect<
      Intersect<
        Intersect<Error, AggregateErrorsProp<AggregateErrorsArg>, never>,
        CustomAttributesArg,
        CoreErrorProps
      >,
      PluginsInstanceMethods<PluginsArg>,
      CoreErrorProps
    >,
    PluginsProperties<PluginsArg>,
    ConstErrorProps | keyof PluginsInstanceMethods<PluginsArg>
  >,
  ErrorPropsArg,
  ConstErrorProps | keyof PluginsInstanceMethods<PluginsArg>
>

/**
 * Error instance object
 */
export type ErrorInstance<PluginsArg extends Plugins = []> = BaseError<
  PluginsArg,
  ErrorProps,
  CustomAttributes,
  AggregateErrorsOption
>
