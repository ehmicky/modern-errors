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
   * export const InputError = AnyError.create('InputError', {
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
  readonly custom?: AnyError
}

type CustomErrorClass<
  ErrorNameArg extends ErrorName,
  CustomOption extends AnyError,
> = {
  new (
    ...args: ConstructorParameters<CustomOption>
  ): InstanceType<CustomOption> & { name: ErrorNameArg }
  prototype: InstanceType<CustomOption> & { name: ErrorNameArg }
} & Omit<CustomOption, 'prototype'>

type DefaultErrorClass<ErrorNameArg extends ErrorName> = {
  new (...args: ErrorConstructorArgs): ErrorInstance<ErrorNameArg>
  prototype: ErrorInstance<ErrorNameArg>
}

/**
 * Error class returned by `AnyError.create()`
 */
type ErrorClass<
  ErrorNameArg extends ErrorName,
  OptionsArgs extends ClassOptions,
> = OptionsArgs['custom'] extends AnyError
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
type AnyError = {
  new (...args: ErrorConstructorArgs): ErrorInstance<ErrorName>
  prototype: ErrorInstance<ErrorName>

  /**
   * Creates and returns an error class.
   * The first error class must be named `UnknownError`.
   *
   * @example
   * ```js
   * export const InputError = AnyError.create('InputError', options)
   * ```
   */
  create<ErrorNameArg extends ErrorName, OptionsArg extends ClassOptions = {}>(
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
 *  // Custom error classes
 *  export const UnknownError = AnyError.create('UnknownError')
 *  export const InputError = AnyError.create('InputError')
 *  export const AuthError = AnyError.create('AuthError')
 *  export const DatabaseError = AnyError.create('DatabaseError')
 * ```
 */
export default function modernErrors(): AnyError
