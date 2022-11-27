import type { MethodOptions } from '../../options/method.js'
import type { UnionToIntersection } from '../../utils/intersect.js'
import type { SliceFirst } from '../../utils/slice.js'
import type { Plugin, Plugins } from '../shape/main.js'

import type { StaticMethod, StaticMethods } from './main.js'

/**
 * Bound static method parameters
 */
type ErrorStaticMethodParams<
  StaticMethodArg extends StaticMethod,
  MethodOptionsArg extends MethodOptions<Plugin>,
> =
  | SliceFirst<Parameters<StaticMethodArg>>
  | ([MethodOptionsArg] extends [never]
      ? never
      : readonly [...SliceFirst<Parameters<StaticMethodArg>>, MethodOptionsArg])

/**
 * Bound static method of a plugin
 */
type ErrorStaticMethod<
  StaticMethodArg extends StaticMethod,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = (
  ...args: ErrorStaticMethodParams<StaticMethodArg, MethodOptionsArg>
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
type PluginStaticMethods<PluginArg extends Plugin> = PluginArg extends {
  staticMethods: StaticMethods
}
  ? ErrorStaticMethods<PluginArg['staticMethods'], MethodOptions<PluginArg>>
  : {}

/**
 * Bound static methods of all plugins
 */
export type PluginsStaticMethods<PluginsArg extends Plugins> =
  UnionToIntersection<PluginStaticMethods<PluginsArg[number]>> & {}
