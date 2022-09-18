import { ErrorName } from 'error-custom-class'

type Class<Instance extends object = object, Args extends any[] = any[]> = {
  new (...args: Args): Instance
  prototype: Instance
}

declare class CustomError<
  ErrorNameArg extends ErrorName = ErrorName,
  Options extends object = object,
> extends Error {
  constructor(message: string, options?: Options & ErrorOptions)
  name: ErrorNameArg
}

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
export declare class AnyError<
  ErrorNameArg extends ErrorName,
> extends CustomError<ErrorNameArg> {
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
  static normalize(error: unknown): CustomError<ErrorName>
}

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
  readonly custom?: typeof AnyError<ErrorName>
}

/**
 * Error classes definitions. Object where:
 *   - Each key is the class name, e.g. `InputError`.
 *     One of the classes must be named `UnknownError`.
 *   - Each value is an object with the class options.
 */
type Definitions = {
  readonly UnknownError: ClassOptions
  readonly [ErrorNameArg: ErrorName]: ClassOptions
}

/**
 * Error class returned by `AnyError.create()`
 */
type ReturnErrorClass<
  DefinitionsArg extends Definitions,
  ErrorNameArg extends ErrorName,
> = DefinitionsArg[ErrorNameArg]['custom'] extends typeof AnyError<ErrorName>
  ? DefinitionsArg[ErrorNameArg]['custom']
  : typeof AnyError<ErrorNameArg>

/**
 * All error classes returned by `modernErrors()`
 */
type ReturnErrorClasses<DefinitionsArg extends Definitions> = {
  [ErrorNameArg in Exclude<
    keyof DefinitionsArg & ErrorName,
    'AnyError'
  >]: ReturnErrorClass<DefinitionsArg, ErrorNameArg>
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
export default function modernErrors<DefinitionsArg extends Definitions>(
  definitions: DefinitionsArg,
): ReturnErrorClasses<DefinitionsArg> & { AnyError: typeof AnyError<ErrorName> }
