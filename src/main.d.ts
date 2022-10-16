import type { ErrorName } from 'error-custom-class'

interface CommonInfo {
  readonly error: BaseError<Plugins, Error, ErrorName, InitOptions<Plugins>>
  readonly options: never
  readonly showStack: boolean
  readonly AnyError: AnyErrorClass<Plugins>
  readonly ErrorClasses: {
    AnyError: never
    UnknownError: ErrorSubclass<
      Plugins,
      ErrorConstructor<Plugins>,
      Error,
      'UnknownError'
    >
    [name: ErrorName]: ErrorSubclass<
      Plugins,
      ErrorConstructor<Plugins>,
      Error,
      ErrorName
    >
  }
  readonly errorInfo: (error: unknown) => Info['errorInfo']
}

export type Info = {
  properties: CommonInfo
  instanceMethods: CommonInfo
  staticMethods: Omit<CommonInfo, 'error' | 'showStack'>
  errorInfo: Omit<CommonInfo, 'AnyError' | 'ErrorClasses' | 'errorInfo'>
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
  OptionsArg extends unknown,
> = (
  ...args: [...SliceFirst<Parameters<InstanceMethodArg>>, OptionsArg?]
) => ReturnType<InstanceMethodArg>

type ErrorInstanceMethods<
  InstanceMethodsArg extends InstanceMethods,
  OptionsArg extends unknown,
> = {
  readonly [MethodName in keyof InstanceMethodsArg]: ErrorInstanceMethod<
    InstanceMethodsArg[MethodName],
    OptionsArg
  >
}

type PluginInstanceMethods<PluginArg extends Plugin> = PluginArg extends Plugin
  ? PluginArg['instanceMethods'] extends InstanceMethods
    ? ErrorInstanceMethods<
        PluginArg['instanceMethods'],
        PluginOptions<PluginArg>
      >
    : {}
  : {}

type PluginsInstanceMethods<PluginsArg extends Plugins> = UnionToIntersection<
  PluginInstanceMethods<PluginsArg[number]>
>

type ErrorStaticMethod<
  StaticMethodArg extends StaticMethod,
  OptionsArg extends unknown,
> = (
  ...args: [...SliceFirst<Parameters<StaticMethodArg>>, OptionsArg?]
) => ReturnType<StaticMethodArg>

type ErrorStaticMethods<
  StaticMethodsArg extends StaticMethods,
  OptionsArg extends unknown,
> = {
  readonly [MethodName in keyof StaticMethodsArg]: ErrorStaticMethod<
    StaticMethodsArg[MethodName],
    OptionsArg
  >
}

type PluginStaticMethods<PluginArg extends Plugin> = PluginArg extends Plugin
  ? PluginArg['staticMethods'] extends StaticMethods
    ? ErrorStaticMethods<PluginArg['staticMethods'], PluginOptions<PluginArg>>
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

type PluginOptions<PluginArg extends Plugin> =
  PluginArg['getOptions'] extends NonNullable<Plugin['getOptions']>
    ? Parameters<PluginArg['getOptions']>[0]
    : never

type NoAdditionalProps<
  T extends object,
  U extends object,
> = keyof T extends keyof U ? T : never

type LiteralString<T extends string> = string extends T ? never : T

type ExternalPluginsOptions<PluginsArg extends Plugins> = {
  readonly [PluginArg in PluginsArg[number] as LiteralString<
    PluginArg['name']
  >]?: PluginOptions<PluginArg>
}

interface CorePluginsOptions {
  props?: object
}

type PluginsOptions<PluginsArg extends Plugins> =
  keyof ExternalPluginsOptions<PluginsArg> extends never
    ? CorePluginsOptions
    : CorePluginsOptions & ExternalPluginsOptions<PluginsArg>

type InitOptions<PluginsArg extends Plugins> = {
  cause?: unknown
  errors?: unknown[]
} & PluginsOptions<PluginsArg>

type BaseError<
  PluginsArg extends Plugins,
  ErrorArg extends Error,
  ErrorNameArg extends ErrorName,
  Options extends InitOptions<PluginsArg>,
> = Omit<ErrorArg, 'name'> & { name: ErrorNameArg } & Pick<
    unknown extends Options['errors'] ? InitOptions<PluginsArg> : Options,
    'errors'
  > &
  Options['props'] &
  PluginsInstanceMethods<PluginsArg> &
  PluginsProperties<PluginsArg>

export type ErrorInstance<PluginsArg extends Plugins = []> = BaseError<
  PluginsArg,
  Error,
  ErrorName,
  InitOptions<PluginsArg>
>

type ErrorConstructor<PluginsArg extends Plugins> = new (
  message: string,
  options?: InitOptions<PluginsArg>,
  ...extra: any[]
) => Error

type MaybeIntersect<T extends object, U extends object> = keyof U extends never
  ? T
  : T & U

type ParentOptions<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = ConstructorParameters<ParentErrorClass>[1] & InitOptions<PluginsArg>

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
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  ErrorArg extends Error,
  ErrorNameArg extends ErrorName,
> = MaybeIntersect<
  {
    new <
      Options extends ParentOptions<
        PluginsArg,
        ParentErrorClass
      > = ParentOptions<PluginsArg, ParentErrorClass>,
    >(
      message: string,
      options?: NoAdditionalProps<
        Options,
        ParentOptions<PluginsArg, ParentErrorClass>
      >,
      ...extra: ParentExtra<PluginsArg, ParentErrorClass>
    ): BaseError<PluginsArg, ErrorArg, ErrorNameArg, Options>
    prototype: BaseError<
      PluginsArg,
      ErrorArg,
      ErrorNameArg,
      InitOptions<PluginsArg>
    >
    subclass: CreateSubclass<PluginsArg, ParentErrorClass, ErrorArg>
  },
  Omit<ParentErrorClass, keyof AnyErrorClass<PluginsArg>>
>

export type ErrorClass<PluginsArg extends Plugins = []> = ErrorSubclass<
  PluginsArg,
  ErrorConstructor<PluginsArg>,
  Error,
  ErrorName
>

/**
 * Class-specific options
 */
type ClassOptions<
  PluginsArg extends Plugins,
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
    ParentErrorClass,
    ErrorArg,
    ErrorName
  >
} & PluginsOptions<PluginsArg>

type CreateSubclass<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  ErrorArg extends Error,
> = <
  ErrorNameArg extends ErrorName,
  OptionsArg extends ClassOptions<PluginsArg, ParentErrorClass, ErrorArg>,
>(
  errorName: ErrorNameArg,
  options?: OptionsArg,
) => ErrorSubclass<
  PluginsArg,
  OptionsArg['custom'] extends ErrorConstructor<PluginsArg>
    ? OptionsArg['custom']
    : ParentErrorClass,
  OptionsArg['custom'] extends ErrorConstructor<PluginsArg>
    ? InstanceType<OptionsArg['custom']> &
        InstanceType<ErrorConstructor<PluginsArg>>
    : InstanceType<ParentErrorClass>,
  ErrorNameArg
>

type NormalizeError<
  PluginsArg extends Plugins,
  ErrorArg extends unknown,
  Options extends InitOptions<PluginsArg>,
> = ErrorArg extends BaseError<PluginsArg, Error, ErrorName, Options>
  ? ErrorArg
  : ErrorArg extends Error
  ? BaseError<PluginsArg, ErrorArg, 'UnknownError', Options>
  : unknown extends ErrorArg
  ? BaseError<PluginsArg, Error, ErrorName, Options>
  : BaseError<PluginsArg, Error, 'UnknownError', Options>

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
export type AnyErrorClass<PluginsArg extends Plugins = []> = {
  new <Options extends InitOptions<PluginsArg> = InitOptions<PluginsArg>>(
    message: string,
    options?: NoAdditionalProps<Options, InitOptions<PluginsArg>>,
    ...extra: any[]
  ): NormalizeError<PluginsArg, Options['cause'], Options>
  prototype: BaseError<PluginsArg, Error, ErrorName, InitOptions<PluginsArg>>

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
  subclass: CreateSubclass<
    PluginsArg,
    AnyErrorClass<PluginsArg>,
    BaseError<PluginsArg, Error, ErrorName, InitOptions<PluginsArg>>
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
  ): NormalizeError<PluginsArg, ErrorArg, InitOptions<PluginsArg>>
} & PluginsStaticMethods<PluginsArg>

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
export default function modernErrors<PluginsArg extends Plugins = []>(
  plugins?: PluginsArg,
  options?: PluginsOptions<PluginsArg>,
): AnyErrorClass<PluginsArg>
