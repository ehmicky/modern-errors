import type { Plugins } from '../../plugins/shape.js'
import type { SpecificInstanceOptions, Cause } from '../../options/instance.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type { AggregateErrors } from '../../base/aggregate.js'

/**
 * `constructor` of the `custom` option
 */
export type ErrorConstructor = new (
  message: string,
  options?: object,
  ...extra: readonly any[]
) => Error

/**
 * Second argument of the `constructor` of the parent error class
 */
export type ParentInstanceOptions<
  PluginsArg extends Plugins,
  ChildProps extends ErrorProps,
  CustomClass extends ErrorConstructor,
  AggregateErrorsArg extends AggregateErrors,
  CauseArg extends Cause,
> = ConstructorParameters<CustomClass>[1] &
  SpecificInstanceOptions<PluginsArg, ChildProps, AggregateErrorsArg, CauseArg>

/**
 * Last variadic arguments of the `constructor` of the parent error class
 */
export type ParentExtra<CustomClass extends ErrorConstructor> =
  ConstructorParameters<CustomClass> extends readonly [
    unknown,
    unknown?,
    ...infer Extra extends readonly unknown[],
  ]
    ? Extra
    : readonly never[]
