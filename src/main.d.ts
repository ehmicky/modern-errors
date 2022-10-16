import type { ErrorName } from 'error-custom-class'
import type MergeErrorCause from 'merge-error-cause'

interface Info {
  readonly error: CoreError<Plugins, Error, ErrorName, InitOptions<Plugins>>
  readonly options: never
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
interface Plugin {
  readonly name: string
  readonly getOptions?: (input: never, full: boolean) => unknown
  readonly instanceMethods?: {
    readonly [MethodName: string]: (info: Info, ...args: never[]) => unknown
  }
}

type Plugins = readonly Plugin[]

type PluginOptions<PluginArg extends Plugin> =
  PluginArg['getOptions'] extends NonNullable<Plugin['getOptions']>
    ? Parameters<PluginArg['getOptions']>[0]
    : never

type LiteralString<T extends string> = string extends T ? never : T

type FixEmptyObject<Object extends object> = keyof Object extends never
  ? { _?: never }
  : Object

type PluginsOptions<PluginsArg extends Plugins> = FixEmptyObject<{
  readonly [PluginArg in PluginsArg[number] as LiteralString<
    PluginArg['name']
  >]?: PluginOptions<PluginArg>
}>

// TODO: re-enable
// type MergeCause<ErrorInstance extends unknown> = ReturnType<
//   typeof MergeErrorCause<ErrorInstance>
// >

type InitOptions<PluginsArg extends Plugins> = {
  cause?: unknown
  errors?: unknown[]
} & PluginsOptions<PluginsArg>

type CoreError<
  PluginsArg extends Plugins,
  ErrorInstance extends Error,
  ErrorNameArg extends ErrorName,
  Options extends InitOptions<PluginsArg>,
> = Omit<ErrorInstance, 'name'> & { name: ErrorNameArg } & Pick<
    unknown extends Options['errors'] ? InitOptions<PluginsArg> : Options,
    'errors'
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

type ErrorClass<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  ErrorInstance extends Error,
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
      options?: Options,
      ...extra: ParentExtra<PluginsArg, ParentErrorClass>
    ): CoreError<PluginsArg, ErrorInstance, ErrorNameArg, Options>
    prototype: CoreError<
      PluginsArg,
      ErrorInstance,
      ErrorNameArg,
      InitOptions<PluginsArg>
    >
    subclass: CreateSubclass<PluginsArg, ParentErrorClass, ErrorInstance>
  },
  Omit<ParentErrorClass, keyof AnyErrorClass<PluginsArg>>
>

/**
 * Class-specific options
 */
type ClassOptions<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  ErrorInstance extends Error,
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
  readonly custom?: ErrorClass<
    PluginsArg,
    ParentErrorClass,
    ErrorInstance,
    ErrorName
  >
} & PluginsOptions<PluginsArg>

type CreateSubclass<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  ErrorInstance extends Error,
> = <
  ErrorNameArg extends ErrorName,
  OptionsArg extends ClassOptions<PluginsArg, ParentErrorClass, ErrorInstance>,
>(
  errorName: ErrorNameArg,
  options?: OptionsArg,
) => ErrorClass<
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
  ErrorInstance extends unknown,
  Options extends InitOptions<PluginsArg>,
> = ErrorInstance extends CoreError<PluginsArg, Error, ErrorName, Options>
  ? ErrorInstance
  : ErrorInstance extends Error
  ? CoreError<PluginsArg, ErrorInstance, 'UnknownError', Options>
  : unknown extends ErrorInstance
  ? CoreError<PluginsArg, Error, ErrorName, Options>
  : CoreError<PluginsArg, Error, 'UnknownError', Options>

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
type AnyErrorClass<PluginsArg extends Plugins> = {
  new <Options extends InitOptions<PluginsArg> = InitOptions<PluginsArg>>(
    message: string,
    options?: Options,
    ...extra: any[]
  ): NormalizeError<PluginsArg, Options['cause'], Options>
  prototype: CoreError<PluginsArg, Error, ErrorName, InitOptions<PluginsArg>>

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
    CoreError<PluginsArg, Error, ErrorName, InitOptions<PluginsArg>>
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
  normalize<ErrorInstance extends unknown>(
    error: ErrorInstance,
  ): NormalizeError<PluginsArg, ErrorInstance, InitOptions<PluginsArg>>
}

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
  plugins?: PluginsArg & Plugins,
  options?: PluginsOptions<PluginsArg>,
): AnyErrorClass<PluginsArg>
