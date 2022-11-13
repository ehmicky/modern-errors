import type { Plugins } from '../../plugins/shape.js'
import type {
  SpecificInstanceOptions,
  InstanceOptions,
  Cause,
} from '../../options/instance.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type { AggregateErrors } from '../../base/aggregate.js'

/**
 * `custom` option
 */
export type CustomClass = new (
  message: string,
  options?: InstanceOptions,
) => Error

/**
 * Second argument of the `constructor` of the parent error class
 */
export type ParentInstanceOptions<
  PluginsArg extends Plugins,
  ChildProps extends ErrorProps,
  CustomClassArg extends CustomClass,
  AggregateErrorsArg extends AggregateErrors,
  CauseArg extends Cause,
> = ConstructorParameters<CustomClassArg>[1] &
  SpecificInstanceOptions<PluginsArg, ChildProps, AggregateErrorsArg, CauseArg>

/**
 * Last variadic arguments of the `constructor` of the parent error class
 */
export type ParentExtra<CustomClassArg extends CustomClass> =
  ConstructorParameters<CustomClassArg> extends readonly [
    unknown,
    unknown?,
    ...infer Extra extends readonly unknown[],
  ]
    ? Extra
    : readonly never[]
