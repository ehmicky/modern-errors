import type { MethodOptions } from '../options.js'
import type { SliceFirst, UnionToIntersection } from '../utils.js'
import type { Plugin, Plugins, Info } from './main.js'

type StaticMethod = (info: Info['staticMethods'], ...args: never[]) => unknown

export interface StaticMethods {
  readonly [MethodName: string]: StaticMethod
}

type ErrorStaticMethod<
  StaticMethodArg extends StaticMethod,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = (
  ...args: readonly [
    ...SliceFirst<Parameters<StaticMethodArg>>,
    MethodOptionsArg?,
  ]
) => ReturnType<StaticMethodArg>

type ErrorStaticMethods<
  StaticMethodsArg extends StaticMethods,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = {
  readonly [MethodName in keyof StaticMethodsArg]: ErrorStaticMethod<
    StaticMethodsArg[MethodName],
    MethodOptionsArg
  >
}

type PluginStaticMethods<PluginArg extends Plugin> =
  PluginArg['staticMethods'] extends StaticMethods
    ? ErrorStaticMethods<PluginArg['staticMethods'], MethodOptions<PluginArg>>
    : {}

export type PluginsStaticMethods<PluginsArg extends Plugins> =
  UnionToIntersection<PluginStaticMethods<PluginsArg[number]>>
