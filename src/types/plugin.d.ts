import type { ErrorName } from 'error-custom-class'
import type { AnyErrorClass } from './to_sort.js'
import type { ErrorClass } from './class.js'
import type { ErrorInstance } from './instance.js'
import type { MethodOptions } from './options.js'

/**
 *
 */
interface CommonInfo {
  /**
   *
   */
  error: ErrorInstance

  /**
   *
   */
  readonly options: never

  /**
   *
   */
  readonly showStack: boolean

  /**
   *
   */
  readonly AnyError: AnyErrorClass<Plugins>

  /**
   *
   */
  readonly ErrorClasses: {
    AnyError: never
    UnknownError: ErrorClass
    [name: ErrorName]: ErrorClass
  }

  /**
   *
   */
  readonly errorInfo: (error: unknown) => Info['errorInfo']
}

/**
 *
 */
export interface Info {
  /**
   *
   */
  readonly properties: CommonInfo

  /**
   *
   */
  readonly instanceMethods: CommonInfo

  /**
   *
   */
  readonly staticMethods: Omit<CommonInfo, 'error' | 'showStack'>

  /**
   *
   */
  readonly errorInfo: Omit<
    CommonInfo,
    'AnyError' | 'ErrorClasses' | 'errorInfo'
  >
}

type GetOptions = (input: never, full: boolean) => unknown
type IsOptions = (input: unknown) => boolean
type InstanceMethod = (
  info: Info['instanceMethods'],
  ...args: never[]
) => unknown
interface InstanceMethods {
  readonly [MethodName: string]: InstanceMethod
}
type StaticMethod = (info: Info['staticMethods'], ...args: never[]) => unknown
interface StaticMethods {
  readonly [MethodName: string]: StaticMethod
}
type GetProperties = (info: Info['properties']) => {
  [PropName: string]: unknown
}

/**
 * Plugins extend `modern-errors` features.
 *
 * @example
 * ```js
 * import modernErrorsBugs from 'modern-errors-bugs'
 * import modernErrorsSerialize from 'modern-errors-serialize'
 *
 * export const AnyError = modernErrors([modernErrorsBugs, modernErrorsSerialize])
 * ```
 */
export interface Plugin {
  /**
   *
   */
  readonly name: string

  /**
   *
   */
  readonly getOptions?: GetOptions

  /**
   *
   */
  readonly isOptions?: IsOptions

  /**
   *
   */
  readonly instanceMethods?: InstanceMethods

  /**
   *
   */
  readonly staticMethods?: StaticMethods

  /**
   *
   */
  readonly properties?: GetProperties
}

export type Plugins = readonly Plugin[]

type UnionToIntersection<T> = (
  T extends any ? (arg: T) => any : never
) extends (arg: infer U) => any
  ? U
  : never

type SliceFirst<Tuple extends unknown[]> = Tuple extends [
  unknown,
  ...infer Rest,
]
  ? Rest
  : []

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

type PluginProperties<PluginArg extends Plugin> = PluginArg extends Plugin
  ? PluginArg['properties'] extends GetProperties
    ? ReturnType<PluginArg['properties']>
    : {}
  : {}

export type PluginsProperties<PluginsArg extends Plugins> = UnionToIntersection<
  PluginProperties<PluginsArg[number]>
>
