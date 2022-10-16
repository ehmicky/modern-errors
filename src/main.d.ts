import type { ErrorName } from 'error-custom-class'

interface CommonInfo {
  error: ErrorInstance
  readonly options: never
  readonly showStack: boolean
  readonly AnyError: AnyErrorClass<Plugins>
  readonly ErrorClasses: {
    AnyError: never
    UnknownError: ErrorClass
    [name: ErrorName]: ErrorClass
  }
  readonly errorInfo: (error: unknown) => Info['errorInfo']
}

export type Info = {
  readonly properties: CommonInfo
  readonly instanceMethods: CommonInfo
  readonly staticMethods: Omit<CommonInfo, 'error' | 'showStack'>
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
type InstanceMethods = { readonly [MethodName: string]: InstanceMethod }
type StaticMethod = (info: Info['staticMethods'], ...args: never[]) => unknown
type StaticMethods = { readonly [MethodName: string]: StaticMethod }
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
  readonly name: string
  readonly getOptions?: GetOptions
  readonly isOptions?: IsOptions
  readonly instanceMethods?: InstanceMethods
  readonly staticMethods?: StaticMethods
  readonly properties?: GetProperties
}

type Plugins = readonly Plugin[]

type UnionToIntersection<T> = (
  T extends any ? (arg: T) => any : never
) extends (arg: infer U) => any
  ? U
  : never

type SliceFirst<tuple extends unknown[]> = tuple extends [
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

type PluginInstanceMethods<PluginArg extends Plugin> = PluginArg extends Plugin
  ? PluginArg['instanceMethods'] extends InstanceMethods
    ? ErrorInstanceMethods<
        PluginArg['instanceMethods'],
        MethodOptions<PluginArg>
      >
    : {}
  : {}

type PluginsInstanceMethods<PluginsArg extends Plugins> = UnionToIntersection<
  PluginInstanceMethods<PluginsArg[number]>
>

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

type PluginStaticMethods<PluginArg extends Plugin> = PluginArg extends Plugin
  ? PluginArg['staticMethods'] extends StaticMethods
    ? ErrorStaticMethods<PluginArg['staticMethods'], MethodOptions<PluginArg>>
    : {}
  : {}

type PluginsStaticMethods<PluginsArg extends Plugins> = UnionToIntersection<
  PluginStaticMethods<PluginsArg[number]>
>

type PluginProperties<PluginArg extends Plugin> = PluginArg extends Plugin
  ? PluginArg['properties'] extends GetProperties
    ? ReturnType<PluginArg['properties']>
    : {}
  : {}

type PluginsProperties<PluginsArg extends Plugins> = UnionToIntersection<
  PluginProperties<PluginsArg[number]>
>

type NoAdditionalProps<
  T extends object,
  U extends object,
> = keyof T extends keyof U ? T : never

type LiteralString<T extends string> = string extends T ? never : T

type ExternalPluginOptions<PluginArg extends Plugin> =
  PluginArg['getOptions'] extends NonNullable<Plugin['getOptions']>
    ? Parameters<PluginArg['getOptions']>[0]
    : never

type ExternalPluginsOptions<PluginsArg extends Plugins> = {
  readonly [PluginArg in PluginsArg[number] as LiteralString<
    PluginArg['name']
  >]?: ExternalPluginOptions<PluginArg>
}

type MethodOptions<PluginArg extends Plugin> = ExternalPluginOptions<PluginArg>

type ErrorProps = object

type MergeProps<
  PropsOne extends ErrorProps,
  PropsTwo extends ErrorProps,
> = PropsOne & PropsTwo

type GetPropsOption<OptionsArg extends object> = OptionsArg extends {
  props: infer PropsArg extends ErrorProps
}
  ? PropsArg
  : {}

interface CorePluginsOptions {
  readonly props?: ErrorProps
}

type PluginsOptions<PluginsArg extends Plugins> =
  keyof ExternalPluginsOptions<PluginsArg> extends never
    ? CorePluginsOptions
    : CorePluginsOptions & ExternalPluginsOptions<PluginsArg>

type InstanceOptions<PluginsArg extends Plugins> = {
  readonly cause?: unknown
  readonly errors?: unknown[]
} & PluginsOptions<PluginsArg>

/**
 * Class-specific options
 */
type ClassOptions<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  ErrorArg extends Error,
> = {
  /**
   * Custom class to add any methods, `constructor` or properties.
   *
   * @example
   * ```js
   * export const InputError = AnyError.subclass('InputError', {
   *   // The `class` must extend from `AnyError`
   *   custom: class extends AnyError {
   *     // If a `constructor` is defined, its parameters must be (message, options)
   *     // like `AnyError`
   *     constructor(message, options) {
   *       // Modifying `message` or `options` should be done before `super()`
   *       message += message.endsWith('.') ? '' : '.'
   *
   *       // All arguments should be forwarded to `super()`, including any
   *       // custom `options` or additional `constructor` parameters
   *       super(message, options)
   *
   *       // `name` is automatically added, so this is not necessary
   *       // this.name = 'InputError'
   *     }
   *
   *     isUserInput() {
   *       // ...
   *     }
   *   },
   * })
   *
   * const error = new InputError('Wrong user name')
   * console.log(error.message) // 'Wrong user name.'
   * console.log(error.isUserInput())
   * ```
   */
  readonly custom?: ErrorSubclass<
    PluginsArg,
    ErrorPropsArg,
    ParentErrorClass,
    ErrorArg,
    ErrorName
  >
} & PluginsOptions<PluginsArg>

type GlobalOptions<PluginsArg extends Plugins> = PluginsOptions<PluginsArg>

type BaseError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends Error,
  ErrorNameArg extends ErrorName,
  InstanceOptionsArg extends InstanceOptions<PluginsArg>,
> = Omit<ErrorArg, 'name'> & { name: ErrorNameArg } & Pick<
    unknown extends InstanceOptionsArg['errors']
      ? InstanceOptions<PluginsArg>
      : InstanceOptionsArg,
    'errors'
  > &
  ErrorPropsArg &
  InstanceOptionsArg['props'] &
  PluginsInstanceMethods<PluginsArg> &
  PluginsProperties<PluginsArg>

export type ErrorInstance<PluginsArg extends Plugins = []> = BaseError<
  PluginsArg,
  ErrorProps,
  Error,
  ErrorName,
  InstanceOptions<PluginsArg>
>

type ErrorConstructor<PluginsArg extends Plugins> = new (
  message: string,
  options?: InstanceOptions<PluginsArg>,
  ...extra: any[]
) => Error

type MaybeIntersect<T extends object, U extends object> = keyof U extends never
  ? T
  : T & U

type ParentInstanceOptions<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = ConstructorParameters<ParentErrorClass>[1] & InstanceOptions<PluginsArg>

type ParentExtra<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = ConstructorParameters<ParentErrorClass> extends [
  unknown,
  unknown?,
  ...infer Extra,
]
  ? Extra
  : never

type ErrorSubclass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  ErrorArg extends Error,
  ErrorNameArg extends ErrorName,
> = MaybeIntersect<
  {
    new <
      InstanceOptionsArg extends ParentInstanceOptions<
        PluginsArg,
        ParentErrorClass
      > = ParentInstanceOptions<PluginsArg, ParentErrorClass>,
    >(
      message: string,
      options?: NoAdditionalProps<
        InstanceOptionsArg,
        ParentInstanceOptions<PluginsArg, ParentErrorClass>
      >,
      ...extra: ParentExtra<PluginsArg, ParentErrorClass>
    ): BaseError<
      PluginsArg,
      ErrorProps,
      ErrorArg,
      ErrorNameArg,
      InstanceOptionsArg
    >
    readonly prototype: BaseError<
      PluginsArg,
      ErrorPropsArg,
      ErrorArg,
      ErrorNameArg,
      InstanceOptions<PluginsArg>
    >
    readonly subclass: CreateSubclass<
      PluginsArg,
      ErrorPropsArg,
      ParentErrorClass,
      ErrorArg
    >
  },
  Omit<ParentErrorClass, keyof SpecificAnyErrorClass<PluginsArg, ErrorPropsArg>>
>

export type ErrorClass<PluginsArg extends Plugins = []> = ErrorSubclass<
  PluginsArg,
  ErrorProps,
  ErrorConstructor<PluginsArg>,
  Error,
  ErrorName
>

type CreateSubclass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  ErrorArg extends Error,
> = <
  ErrorNameArg extends ErrorName,
  ClassOptionsArg extends ClassOptions<
    PluginsArg,
    ErrorPropsArg,
    ParentErrorClass,
    ErrorArg
  >,
>(
  errorName: ErrorNameArg,
  options?: ClassOptionsArg,
) => ErrorSubclass<
  PluginsArg,
  ErrorPropsArg,
  ClassOptionsArg['custom'] extends ErrorConstructor<PluginsArg>
    ? ClassOptionsArg['custom']
    : ParentErrorClass,
  ClassOptionsArg['custom'] extends ErrorConstructor<PluginsArg>
    ? InstanceType<ClassOptionsArg['custom']> &
        InstanceType<ErrorConstructor<PluginsArg>>
    : InstanceType<ParentErrorClass>,
  ErrorNameArg
>

type NormalizeError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
  InstanceOptionsArg extends InstanceOptions<PluginsArg>,
> = ErrorArg extends ErrorInstance<PluginsArg>
  ? ErrorArg
  : ErrorArg extends Error
  ? BaseError<
      PluginsArg,
      ErrorPropsArg,
      ErrorArg,
      'UnknownError',
      InstanceOptionsArg
    >
  : unknown extends ErrorArg
  ? BaseError<PluginsArg, ErrorPropsArg, Error, ErrorName, InstanceOptionsArg>
  : BaseError<
      PluginsArg,
      ErrorPropsArg,
      Error,
      'UnknownError',
      InstanceOptionsArg
    >

/**
 * Base error class.
 *
 * @example
 * ```js
 * try {
 *   throw new AuthError('...')
 * } catch (cause) {
 *   // Still an AuthError
 *   throw new AnyError('...', { cause })
 * }
 * ```
 */
type SpecificAnyErrorClass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
> = {
  new <
    InstanceOptionsArg extends InstanceOptions<PluginsArg> = InstanceOptions<PluginsArg>,
  >(
    message: string,
    options?: NoAdditionalProps<
      InstanceOptionsArg,
      InstanceOptions<PluginsArg>
    >,
    ...extra: any[]
  ): NormalizeError<
    PluginsArg,
    ErrorPropsArg,
    InstanceOptionsArg['cause'],
    InstanceOptionsArg
  >
  readonly prototype: BaseError<
    PluginsArg,
    ErrorPropsArg,
    Error,
    ErrorName,
    InstanceOptions<PluginsArg>
  >

  /**
   * Creates and returns an error subclass.
   * The first one must be named `UnknownError`.
   * Subclasses can also call `ErrorClass.subclass()` themselves.
   *
   * @example
   * ```js
   * export const InputError = AnyError.subclass('InputError', options)
   * ```
   */
  readonly subclass: CreateSubclass<
    PluginsArg,
    ErrorPropsArg,
    SpecificAnyErrorClass<PluginsArg, ErrorPropsArg>,
    BaseError<
      PluginsArg,
      ErrorPropsArg,
      Error,
      ErrorName,
      InstanceOptions<PluginsArg>
    >
  >

  /**
   * Normalizes invalid errors and assigns the `UnknownError` class to
   * _unknown_ errors.
   *
   * @example
   * ```js
   * try {
   *   throw 'Missing file path.'
   * } catch (error) {
   *   // Normalized from a string to an `Error` instance
   *   throw AnyError.normalize(error)
   * }
   * ```
   */
  normalize<ErrorArg extends unknown>(
    error: ErrorArg,
  ): NormalizeError<
    PluginsArg,
    ErrorPropsArg,
    ErrorArg,
    InstanceOptions<PluginsArg>
  >
} & PluginsStaticMethods<PluginsArg>

export type AnyErrorClass<PluginsArg extends Plugins = []> =
  SpecificAnyErrorClass<PluginsArg, ErrorProps>

/**
 * Creates and returns `AnyError`.
 *
 * @example
 * ```js
 *  // Base error class
 *  export const AnyError = modernErrors()
 *
 *  // The first error class must be named "UnknownError"
 *  export const UnknownError = AnyError.subclass('UnknownError')
 *  export const InputError = AnyError.subclass('InputError')
 *  export const AuthError = AnyError.subclass('AuthError')
 *  export const DatabaseError = AnyError.subclass('DatabaseError')
 * ```
 */
export default function modernErrors<
  PluginsArg extends Plugins = [],
  GlobalOptionsArg extends PluginsOptions<PluginsArg> = {},
>(
  plugins?: PluginsArg,
  options?: GlobalOptionsArg,
): SpecificAnyErrorClass<PluginsArg, GetPropsOption<GlobalOptionsArg>>
