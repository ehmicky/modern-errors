import { CustomError, ErrorName } from 'error-custom-class'

type InvalidProps = 'name' | 'message' | 'stack' | 'errors' | 'cause'

/**
 * Options passed to error constructors' second argument.
 */
export interface Options {
  /**
   * Set as error properties.
   *
   * @example
   * ```js
   * const error = new InputError('Could not read the file.', {
   *   props: { filePath: '/path' },
   * })
   * console.log(error.filePath) // '/path'
   * ```
   */
  readonly props?: { [propName in InvalidProps]?: never } & {
    [propName: string | symbol]: unknown
  }

  /**
   * URL where users should report errors.
   *
   * @example
   * ```js
   * throw new InputError('Could not read the file.', {
   *   bugs: 'https://github.com/my-name/my-project/issues',
   * })
   * // InputError: Could not read the file.
   * // Please report this bug at: https://github.com/my-name/my-project/issues
   * ```
   */
  readonly bugs?: string | URL
}

/**
 * Each known error class's `Error` ancestor class must be typed as `BaseError`.
 * The type parameter must match the class's name.
 *
 * @example
 * ```js
 * export class InputError extends (Error as BaseError<"InputError">) {}
 * ```
 */
export type BaseError<BaseErrorName extends ErrorName> = typeof CustomError<
  BaseErrorName,
  Options
>

/**
 * Base class of all `ErrorClasses` passed to `modernErrors()`.
 * Contains all the features.
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
type AnyError<ErrorClasses extends BaseError<ErrorName>> = ErrorClasses & {
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
  normalize(error: unknown): InstanceType<ErrorClasses>
}

/**
 * Changes the error classes' base class from `Error` to `AnyError`.
 * One of the error classes must be named `UnknownError`.
 *
 * @example
 * ```js
 * // Custom error classes
 * export class InputError extends Error {}
 * export class AuthError extends Error {}
 * export class DatabaseError extends Error {}
 * export class UnknownError extends Error {}
 *
 * // Base error class
 * export const AnyError = modernErrors([
 *   InputError,
 *   AuthError,
 *   DatabaseError,
 *   UnknownError,
 * ])
 * ```
 */
export default function modernErrors<
  ErrorClasses extends BaseError<ErrorName>[],
>(
  ErrorClasses: ErrorClasses,
): BaseError<'UnknownError'> extends ErrorClasses[number]
  ? AnyError<ErrorClasses[number]>
  : never
