import type { MethodOptions } from '../options/method.js'
import type { SliceFirst, UnionToIntersection } from '../utils.js'
import type { Plugin, Plugins } from './shape.js'
import type { Info } from './info.js'

type InstanceMethod = (
  info: Info['instanceMethods'],
  ...args: readonly never[]
) => unknown

export interface InstanceMethods {
  readonly [MethodName: string]: InstanceMethod
}

type ErrorInstanceMethod<
  InstanceMethodArg extends InstanceMethod,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = (
  ...args: readonly [
    ...SliceFirst<Parameters<InstanceMethodArg>>,
    MethodOptionsArg?,
  ]
) => ReturnType<InstanceMethodArg>

type ErrorInstanceMethods<
  InstanceMethodsArg extends InstanceMethods,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = {
  readonly [MethodName in keyof InstanceMethodsArg]: ErrorInstanceMethod<
    InstanceMethodsArg[MethodName],
    MethodOptionsArg
  >
}

type PluginInstanceMethods<PluginArg extends Plugin> =
  PluginArg['instanceMethods'] extends InstanceMethods
    ? ErrorInstanceMethods<
        PluginArg['instanceMethods'],
        MethodOptions<PluginArg>
      >
    : {}

export type PluginsInstanceMethods<PluginsArg extends Plugins> =
  UnionToIntersection<PluginInstanceMethods<PluginsArg[number]>>
