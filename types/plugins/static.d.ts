import type { MethodOptions } from '../options/method.js'
import type { SliceFirst, UnionToIntersection } from '../utils.js'
import type { Plugin, Plugins } from './shape.js'
import type { Info } from './info.js'

/**
 * Unbound static method of a plugin
 */
type StaticMethod = (
  info: Info['staticMethods'],
  ...args: readonly never[]
) => unknown

/**
 * Unbound static methods of a plugin
 */
export interface StaticMethods {
  readonly [MethodName: string]: StaticMethod
}

/**
 * Bound static method of a plugin
 */
type ErrorStaticMethod<
  StaticMethodArg extends StaticMethod,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = (
  ...args: readonly [
    ...SliceFirst<Parameters<StaticMethodArg>>,
    MethodOptionsArg?,
  ]
) => ReturnType<StaticMethodArg>

/**
 * Bound static methods of a plugin, always defined
 */
type ErrorStaticMethods<
  StaticMethodsArg extends StaticMethods,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = {
  readonly [MethodName in keyof StaticMethodsArg]: ErrorStaticMethod<
    StaticMethodsArg[MethodName],
    MethodOptionsArg
  >
}

/**
 * Bound static methods of a plugin, if defined
 */
type PluginStaticMethods<PluginArg extends Plugin> =
  PluginArg['staticMethods'] extends StaticMethods
    ? ErrorStaticMethods<PluginArg['staticMethods'], MethodOptions<PluginArg>>
    : {}

/**
 * Bound static methods of all plugins
 */
export type PluginsStaticMethods<PluginsArg extends Plugins> =
  UnionToIntersection<PluginStaticMethods<PluginsArg[number]>>
