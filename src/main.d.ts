import { ErrorName } from 'error-custom-class'

type ErrorInstance<ErrorNameArg extends ErrorName = ErrorName> = Error & {
  name: ErrorNameArg
}

type ErrorConstructorArgs = [message: string, options?: ErrorOptions]

/**
 * Class-specific options
 */
type ClassOptions = {
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
  readonly custom?: AnyErrorClass
}

type CustomErrorClass<
  ErrorNameArg extends ErrorName,
  CustomOption extends AnyErrorClass,
> = {
  new (
    ...args: ConstructorParameters<CustomOption>
  ): InstanceType<CustomOption> & { name: ErrorNameArg }
  prototype: InstanceType<CustomOption> & { name: ErrorNameArg }
} & Omit<CustomOption, Exclude<keyof AnyErrorClass, 'subclass'>>

type DefaultErrorClass<ErrorNameArg extends ErrorName> = {
  new (...args: ErrorConstructorArgs): ErrorInstance<ErrorNameArg>
  prototype: ErrorInstance<ErrorNameArg>
}

/**
 * Error class returned by `AnyError.subclass()`
 */
type ErrorClass<
  ErrorNameArg extends ErrorName,
  OptionsArgs extends ClassOptions,
> = OptionsArgs['custom'] extends AnyErrorClass
  ? CustomErrorClass<ErrorNameArg, OptionsArgs['custom']>
  : DefaultErrorClass<ErrorNameArg>

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
  new (...args: ErrorConstructorArgs): ErrorInstance<ErrorName>
  prototype: ErrorInstance<ErrorName>

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
  subclass<
    ErrorNameArg extends ErrorName,
    OptionsArg extends ClassOptions = {},
  >(
    errorName: ErrorNameArg,
    options?: OptionsArg,
  ): ErrorClass<ErrorNameArg, OptionsArg>

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
  normalize(error: unknown): ErrorInstance<ErrorName>
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
