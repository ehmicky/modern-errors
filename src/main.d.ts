import type { ErrorName } from 'error-custom-class'
import type MergeErrorCause from 'merge-error-cause'

type MergeCause<ErrorArg extends unknown> = ReturnType<
  typeof MergeErrorCause<ErrorArg>
>

type NamedError<
  ErrorInstance extends Error,
  ErrorNameArg extends ErrorName,
> = Omit<ErrorInstance, 'name'> & { name: ErrorNameArg }

type ErrorConstructor = new (...args: any[]) => Error

interface AnyErrorOptions {
  cause?: unknown
}

type MaybeIntersect<T extends object, U extends object> = keyof U extends never
  ? T
  : T & U

type ErrorClass<
  ParentErrorClass extends ErrorConstructor,
  ErrorInstance extends Error,
  ErrorNameArg extends ErrorName,
> = MaybeIntersect<
  {
    new <InitOptions extends ConstructorParameters<ParentErrorClass>[1] = {}>(
      message: ConstructorParameters<ParentErrorClass>[0],
      options?: InitOptions,
    ): NamedError<ErrorInstance, ErrorNameArg>
    prototype: NamedError<ErrorInstance, ErrorNameArg>
    subclass: CreateSubclass<ParentErrorClass, ErrorInstance>
  },
  Omit<ParentErrorClass, keyof AnyErrorClass>
>

/**
 * Class-specific options
 */
type ClassOptions<
  ParentErrorClass extends ErrorConstructor,
  ErrorInstance extends Error,
> = {
  /**
   * Custom class to add any methods, `constructor` or properties.
   * It must `extend` from `AnyError`.
   *
   * @example
   * ```js
   * export const InputError = AnyError.subclass('InputError', {
   *   custom: class extends AnyError {
   *     constructor(message, options) {
   *       // Modifying `message` or `options` should be done before `super()`
   *       message += message.endsWith('.') ? '' : '.'
   *
   *       // `super()` should be called with both arguments
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
  readonly custom?: ErrorClass<ParentErrorClass, ErrorInstance, ErrorName>
}

type CreateSubclass<
  ParentErrorClass extends ErrorConstructor,
  ErrorInstance extends Error,
> = <
  ErrorNameArg extends ErrorName,
  OptionsArg extends ClassOptions<ParentErrorClass, ErrorInstance>,
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
  ErrorNameArg
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
type AnyErrorClass = {
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
  subclass: CreateSubclass<AnyErrorClass, NamedError<Error, ErrorName>>

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
export default function modernErrors(plugins: Plugin[]): AnyErrorClass

interface Plugin {
  name: string
}
