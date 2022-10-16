import type { ErrorName } from 'error-custom-class'
import type MergeErrorCause from 'merge-error-cause'

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
  readonly getOptions?: (input: any) => any
}

type Plugins = readonly Plugin[]

type PluginOptions<PluginArg extends Plugin> =
  PluginArg['getOptions'] extends NonNullable<Plugin['getOptions']>
    ? Parameters<PluginArg['getOptions']>[0]
    : never

type LiteralString<T extends string> = string extends T ? never : T

type PluginsOptions<PluginsArg extends Plugins> = {
  readonly [PluginArg in PluginsArg[number] as LiteralString<
    PluginArg['name']
  >]?: PluginOptions<PluginArg>
}

// TODO: re-enable
// type MergeCause<ErrorInstance extends unknown> = ReturnType<
//   typeof MergeErrorCause<ErrorInstance>
// >

type NamedError<
  ErrorInstance extends Error,
  ErrorNameArg extends ErrorName,
> = Omit<ErrorInstance, 'name'> & { name: ErrorNameArg }

type InitOptions = {
  cause?: unknown
}

type CoreError<
  ErrorInstance extends Error,
  ErrorNameArg extends ErrorName,
  Options extends InitOptions,
> = NamedError<ErrorInstance, ErrorNameArg>

type ErrorConstructor = new (...args: any[]) => Error

type MaybeIntersect<T extends object, U extends object> = keyof U extends never
  ? T
  : T & U

type ErrorClass<
  ParentErrorClass extends ErrorConstructor,
  ErrorInstance extends Error,
  ErrorNameArg extends ErrorName,
  PluginsArg extends Plugins = [],
> = MaybeIntersect<
  {
    new <
      Options extends ConstructorParameters<ParentErrorClass>[1] = ConstructorParameters<ParentErrorClass>[1],
    >(
      message: string,
      options?: Options,
    ): CoreError<ErrorInstance, ErrorNameArg, Options>
    prototype: CoreError<ErrorInstance, ErrorNameArg, InitOptions>
    subclass: CreateSubclass<ParentErrorClass, ErrorInstance, PluginsArg>
  },
  Omit<ParentErrorClass, keyof AnyErrorClass<PluginsArg>>
>

/**
 * Class-specific options
 */
type ClassOptions<
  ParentErrorClass extends ErrorConstructor,
  ErrorInstance extends Error,
  PluginsArg extends Plugins = [],
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
    ParentErrorClass,
    ErrorInstance,
    ErrorName,
    PluginsArg
  >
}

type CreateSubclass<
  ParentErrorClass extends ErrorConstructor,
  ErrorInstance extends Error,
  PluginsArg extends Plugins = [],
> = <
  ErrorNameArg extends ErrorName,
  OptionsArg extends ClassOptions<ParentErrorClass, ErrorInstance, PluginsArg>,
>(
  errorName: ErrorNameArg,
  options?: OptionsArg,
) => ErrorClass<
  OptionsArg['custom'] extends ErrorConstructor
    ? OptionsArg['custom']
    : ParentErrorClass,
  OptionsArg['custom'] extends ErrorConstructor
    ? InstanceType<OptionsArg['custom']>
    : InstanceType<ParentErrorClass>,
  ErrorNameArg,
  PluginsArg
>

type NormalizeError<
  ErrorInstance extends unknown,
  Options extends InitOptions,
> = ErrorInstance extends CoreError<Error, ErrorName, Options>
  ? ErrorInstance
  : CoreError<
      ErrorInstance extends Error ? ErrorInstance : Error,
      'UnknownError',
      Options
    >

type AnyReturn<Options extends InitOptions> = unknown extends Options['cause']
  ? CoreError<Error, ErrorName, Options>
  : NormalizeError<Options['cause'], Options>

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
type AnyErrorClass<PluginsArg extends Plugins = []> = {
  new <Options extends InitOptions = InitOptions>(
    message: string,
    options?: Options,
  ): AnyReturn<Options>
  prototype: CoreError<Error, ErrorName, InitOptions>

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
    AnyErrorClass<PluginsArg>,
    NamedError<Error, ErrorName>,
    PluginsArg
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
  ): NormalizeError<ErrorInstance, InitOptions>
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
  plugins?: PluginsArg,
  options?: PluginsOptions<PluginsArg>,
): AnyErrorClass<PluginsArg>
