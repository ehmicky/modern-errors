import type { Plugins } from '../../plugins/shape.js'
import type { PluginsInstanceMethods } from '../../plugins/instance.js'
import type { PluginsProperties } from '../../plugins/properties.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type { CustomAttributes } from '../../subclass/custom.js'
import type { Intersect } from '../../utils.js'
import type {
  AggregateErrorsOption,
  AggregateErrorsProp,
} from '../aggregate.js'

type CoreErrorProps = keyof Error | 'errors'
type ConstErrorProps = Exclude<CoreErrorProps, 'message' | 'stack'>

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
 *
 */
export type ErrorInstance<PluginsArg extends Plugins = []> = BaseError<
  PluginsArg,
  ErrorProps,
  CustomAttributes,
  AggregateErrorsOption
>
