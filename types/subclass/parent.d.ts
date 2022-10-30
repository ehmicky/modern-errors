import type { Plugins } from '../plugins/shape.js'
import type { SpecificInstanceOptions } from '../options/instance.js'
import type { ErrorInstance } from '../any/modify.js'

export type ErrorConstructor<PluginsArg extends Plugins> = new (
  message: string,
  options?: SpecificInstanceOptions<PluginsArg>,
  ...extra: readonly any[]
) => ErrorInstance<PluginsArg>

export type ParentInstanceOptions<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = ConstructorParameters<ParentErrorClass>[1] &
  SpecificInstanceOptions<PluginsArg>

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
