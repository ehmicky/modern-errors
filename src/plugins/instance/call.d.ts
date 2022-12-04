import type { MethodOptions } from '../../options/method.js'
import type { UnionToIntersection } from '../../utils/intersect.js'
import type { SliceFirst } from '../../utils/slice.js'
import type { Plugin, Plugins } from '../shape/main.js'

import type { InstanceMethods, InstanceMethod } from './main.js'

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
  UnionToIntersection<PluginInstanceMethods<PluginsArg[number]>> & {}
