import type { MethodOptions } from '../options/method.js'
import type { SliceFirst, UnionToIntersection } from '../utils.js'
import type { Plugin, Plugins } from './shape.js'
import type { Info } from './info.js'

/**
 * Unbound instance method of a plugin
 */
type InstanceMethod = (
  info: Info['instanceMethods'],
  ...args: readonly never[]
) => unknown

/**
 * Unbound instance methods of a plugin
 */
export interface InstanceMethods {
  readonly [MethodName: string]: InstanceMethod
}

/**
 * Bound instance method parameters
 */
type ErrorInstanceMethodParams<
  InstanceMethodArg extends InstanceMethod,
  MethodOptionsArg extends MethodOptions<Plugin>,
> =
  | SliceFirst<Parameters<InstanceMethodArg>>
  | ([MethodOptionsArg] extends [never]
      ? never
      : readonly [
          ...SliceFirst<Parameters<InstanceMethodArg>>,
          MethodOptionsArg,
        ])

/**
 * Bound instance method of a plugin
 */
type ErrorInstanceMethod<
  InstanceMethodArg extends InstanceMethod,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = (
  ...args: ErrorInstanceMethodParams<InstanceMethodArg, MethodOptionsArg>
) => ReturnType<InstanceMethodArg>

/**
 * Bound instance methods of a plugin, always defined
 */
type ErrorInstanceMethods<
  InstanceMethodsArg extends InstanceMethods,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = {
  readonly [MethodName in keyof InstanceMethodsArg]: ErrorInstanceMethod<
    InstanceMethodsArg[MethodName],
    MethodOptionsArg
  >
}

/**
 * Bound instance methods of a plugin, if defined
 */
type PluginInstanceMethods<PluginArg extends Plugin> = PluginArg extends {
  instanceMethods: InstanceMethods
}
  ? ErrorInstanceMethods<PluginArg['instanceMethods'], MethodOptions<PluginArg>>
  : {}

/**
 * Bound instance methods of all plugins
 */
export type PluginsInstanceMethods<PluginsArg extends Plugins> =
  UnionToIntersection<PluginInstanceMethods<PluginsArg[number]>>
