import type { Plugins } from '../../plugins/shape.js'
import type { SpecificInstanceOptions, Cause } from '../../options/instance.js'
import type { ErrorProps } from '../../core_plugins/props/main.js'
import type { AggregateErrors } from '../../base/aggregate.js'

/**
 * `constructor` of the `custom` option
 */
// TODO: fix, return type should be ErrorInstance
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
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor,
  AggregateErrorsArg extends AggregateErrors,
  CauseArg extends Cause,
> = ConstructorParameters<ParentErrorClass>[1] &
  SpecificInstanceOptions<
    PluginsArg,
    ErrorPropsArg,
    AggregateErrorsArg,
    CauseArg
  >

/**
 * Last variadic arguments of the `constructor` of the parent error class
 */
export type ParentExtra<ParentErrorClass extends ErrorConstructor> =
  ConstructorParameters<ParentErrorClass> extends readonly [
    unknown,
    unknown?,
    ...infer Extra extends readonly unknown[],
  ]
    ? Extra
    : readonly never[]
