import { ErrorName } from 'error-custom-class'

type ErrorInstance<
  ErrorNameArg extends ErrorName = ErrorName,
  ErrorArg extends Error = Error,
> = ErrorArg & { name: ErrorNameArg }

type ErrorClass<
  ErrorInstanceArg extends ErrorInstance = ErrorInstance,
  ErrorConstructorArgs extends any[] = any[],
> = {
  new (...args: ErrorConstructorArgs): ErrorInstanceArg
  prototype: ErrorInstanceArg
  subclass: CreateSubclass<ErrorClass<ErrorInstanceArg>>
}

/**
 * Class-specific options
 */
type ClassOptions<ParentError extends ErrorClass> = {
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
  readonly custom?: ParentError
}

type MaybeIntersect<T extends object, U extends object> = keyof U extends never
  ? T
  : T & U

type ErrorSubclass<
  ErrorNameArg extends ErrorName,
  ParentErrorClass extends ErrorClass,
> = MaybeIntersect<
  ErrorClass<
    ErrorInstance<ErrorNameArg, InstanceType<ParentErrorClass>>,
    ConstructorParameters<ParentErrorClass>
  >,
  Omit<ParentErrorClass, keyof AnyErrorClass>
>

type CreateSubclass<ParentErrorClass extends ErrorClass> = <
  ErrorNameArg extends ErrorName,
  OptionsArg extends ClassOptions<ParentErrorClass>,
>(
  errorName: ErrorNameArg,
  options?: OptionsArg,
) => ErrorSubclass<
  ErrorNameArg,
  OptionsArg['custom'] extends ParentErrorClass
    ? OptionsArg['custom']
    : ParentErrorClass
>

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
  new (message: string, options?: ErrorOptions): ErrorInstance
  prototype: ErrorInstance

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
  subclass: CreateSubclass<AnyErrorClass>

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
  normalize(error: unknown): ErrorInstance
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
export default function modernErrors(): AnyErrorClass
