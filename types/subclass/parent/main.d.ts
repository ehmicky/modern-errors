import type { Plugins } from '../../plugins/shape.js'
import type { SpecificInstanceOptions } from '../../options/instance.js'
import type { ErrorInstance } from '../../base/modify/main.js'

/**
 * `constructor` of the `custom` option
 */
export type ErrorConstructor<PluginsArg extends Plugins> = new (
  message: string,
  options?: object,
  ...extra: readonly any[]
) => ErrorInstance<PluginsArg>

/**
 * Second argument of the `constructor` of the parent error class
 */
export type ParentInstanceOptions<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = ConstructorParameters<ParentErrorClass>[1] &
  SpecificInstanceOptions<PluginsArg>

/**
 * Last variadic arguments of the `constructor` of the parent error class
 */
export type ParentExtra<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = ConstructorParameters<ParentErrorClass> extends readonly [
  unknown,
  unknown?,
  ...infer Extra extends readonly unknown[],
]
  ? Extra
  : readonly never[]
