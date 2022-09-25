import type { ErrorName } from 'error-custom-class'
import type MergeErrorCause from 'merge-error-cause'

/**
 * Plugins extend `modern-errors` features.
 *
 * @example
 * ```js
 * import modernErrorsBugs from 'modern-errors-bugs'
 * import modernErrorsProps from 'modern-errors-props'
 *
 * export const AnyError = modernErrors([modernErrorsProps, modernErrorsBugs])
 * ```
 */
interface Plugin {
  readonly name: string
  readonly normalize?: (input: { options: any }) => any
}

type Plugins = readonly Plugin[]

type PluginOptions<PluginArg extends Plugin> =
  PluginArg['normalize'] extends NonNullable<Plugin['normalize']>
    ? Parameters<PluginArg['normalize']>[0]['options']
    : never

type LiteralString<T extends string> = string extends T ? never : T

type PluginsOptions<PluginsArg extends Plugins> = {
  readonly [PluginArg in PluginsArg[number] as LiteralString<
    PluginArg['name']
  >]?: PluginOptions<PluginArg>
}

type MergeCause<ErrorArg extends unknown> = ReturnType<
  typeof MergeErrorCause<ErrorArg>
>

type NamedError<
  ErrorInstance extends Error,
  ErrorNameArg extends ErrorName,
> = Omit<ErrorInstance, 'name'> & { name: ErrorNameArg }

type ErrorConstructor = new (...args: any[]) => Error

type AnyErrorOptions = {
  cause?: unknown
}

type MaybeIntersect<T extends object, U extends object> = keyof U extends never
  ? T
  : T & U

type ErrorClass<
  ParentErrorClass extends ErrorConstructor,
  ErrorInstance extends Error,
  ErrorNameArg extends ErrorName,
  PluginsArg extends Plugins,
> = MaybeIntersect<
  {
    new <InitOptions extends ConstructorParameters<ParentErrorClass>[1] = {}>(
      message: ConstructorParameters<ParentErrorClass>[0],
      options?: InitOptions,
    ): NamedError<ErrorInstance, ErrorNameArg>
    prototype: NamedError<ErrorInstance, ErrorNameArg>
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
  PluginsArg extends Plugins,
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
   *       return this.message.includes('user')
   *     }
   *   },
   * })
   *
   * const error = new InputError('Wrong user name')
   * console.log(error.message) // 'Wrong user name.'
   * console.log(error.isUserInput()) // true
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
  PluginsArg extends Plugins,
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

type AnyErrorReturn<Cause extends unknown> = Cause extends NamedError<
  Error,
  ErrorName
>
  ? MergeCause<Cause>
  : NamedError<Cause extends Error ? MergeCause<Cause> : Error, 'UnknownError'>

/**
 * Base error class.
 *
 * @example
 * ```js
 * try {
 *   throw new AuthError('Could not authenticate.')
 * } catch (cause) {
 *   throw new AnyError('Could not read the file.', { cause })
 *   // Still an AuthError
 * }
 * ```
 */
type AnyErrorClass<PluginsArg extends Plugins> = {
  new <InitOptions extends AnyErrorOptions = {}>(
    message: string,
    options?: InitOptions,
  ): AnyErrorReturn<
    unknown extends InitOptions['cause']
      ? NamedError<Error, ErrorName>
      : InitOptions['cause']
  >
  prototype: NamedError<Error, ErrorName>

  /**
   * Creates and returns an error subclass.
   * One of them must be named `UnknownError`.
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
   * _unknown_ errors. This should wrap each main function.
   *
   * @example
   * ```js
   * export const main = async function (filePath) {
   *   try {
   *     return await readContents(filePath)
   *   } catch (error) {
   *     throw AnyError.normalize(error)
   *   }
   * }
   * ```
   */
  normalize<T extends unknown>(error: T): AnyErrorReturn<T>
}

/**
 * Creates and returns `AnyError`.
 *
 * @example
 * ```js
 *  // Base error class
 *  export const AnyError = modernErrors()
 *
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
