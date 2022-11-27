import type { MethodOptions } from '../options/method.js'
import type { SliceFirst, UnionToIntersection } from '../utils/main.js'
import type { InstanceMethod, InstanceMethods } from './instance/add.js'
import type { Plugin, Plugins } from './shape/main.js'

/**
 * Bound mixed method parameters
 */
type ErrorMixedMethodParams<
  InstanceMethodArg extends InstanceMethod,
  MethodOptionsArg extends MethodOptions<Plugin>,
> =
  | readonly [unknown, ...SliceFirst<Parameters<InstanceMethodArg>>]
  | ([MethodOptionsArg] extends [never]
      ? never
      : readonly [
          unknown,
          ...SliceFirst<Parameters<InstanceMethodArg>>,
          MethodOptionsArg,
        ])

/**
 * Bound mixed method of a plugin
 */
type ErrorMixedMethod<
  InstanceMethodArg extends InstanceMethod,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = (
  ...args: ErrorMixedMethodParams<InstanceMethodArg, MethodOptionsArg>
) => ReturnType<InstanceMethodArg>

/**
 * Bound mixed methods of a plugin, always defined
 */
type ErrorMixedMethods<
  InstanceMethodsArg extends InstanceMethods,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = {
  readonly [MethodName in keyof InstanceMethodsArg]: ErrorMixedMethod<
    InstanceMethodsArg[MethodName],
    MethodOptionsArg
  >
}

/**
 * Bound mixed methods of a plugin, if defined
 */
type PluginMixedMethods<PluginArg extends Plugin> = PluginArg extends {
  instanceMethods: InstanceMethods
}
  ? ErrorMixedMethods<PluginArg['instanceMethods'], MethodOptions<PluginArg>>
  : {}

/**
 * Bound mixed methods of all plugins
 */
export type PluginsMixedMethods<PluginsArg extends Plugins> =
  UnionToIntersection<PluginMixedMethods<PluginsArg[number]>> & {}
