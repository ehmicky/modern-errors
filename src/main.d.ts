import {
  ErrorName,
  OnCreate as RawOnCreate,
  ErrorType as RawErrorType,
  ErrorParams,
} from 'create-error-types'
import { parse, ErrorObject } from 'error-serializer'

export interface Options<T extends ErrorParams = ErrorParams> {
  /**
   * URL where users should report internal errors/bugs.
   *
   * @example 'https://github.com/my-name/my-project/issues'
   */
  bugsUrl?: string | URL

  /**
   * Called on any `new ErrorType('message', parameters)`.
   * Can be used to customize error parameters or to set error type properties.
   * By default, any `parameters` are set as error properties.
   *
   * @example
   * ```js
   * modernErrors({
   *   onCreate(error, parameters) {
   *     const { filePath } = parameters
   *
   *     if (typeof filePath !== 'string') {
   *       throw new Error('filePath must be a string.')
   *     }
   *
   *     const hasFilePath = filePath !== undefined
   *     Object.assign(error, { filePath, hasFilePath })
   *   },
   * })
   * ```
   */
  onCreate?: OnCreate<T>
}

export type OnCreate<T extends ErrorParams = ErrorParams> = (
  error: ErrorType<T>,
  params: Parameters<RawOnCreate<T>>[1],
) => ReturnType<RawOnCreate<T>>

/**
 * Any error type can be retrieved from the return value.
 * For example, `InputError`, `AuthError`, etc.
 *
 * @example
 * ```js
 * export const {
 *   errorHandler,
 *   InputError,
 *   AuthError,
 *   DatabaseError,
 * } = modernErrors()
 * ```
 */
export type Result<T extends ErrorParams = ErrorParams> = {
  [errorName in ErrorName]: typeof ErrorType<T>
} & {
  /**
   * Error handler that should wrap each main function.
   *
   * @example
   * ```js
   * export const main = async function (filePath) {
   *   try {
   *     return await readContents(filePath)
   *   } catch (error) {
   *     // `errorHandler()` returns `error`, so `throw` must be used
   *     throw errorHandler(error)
   *   }
   * }
   * ```
   */
  errorHandler: ErrorHandler

  /**
   * @example
   * ```js
   * ```
   */
  parse: Parse
}

/**
 *
 */
export class ErrorType<
  T extends ErrorParams = ErrorParams,
> extends RawErrorType<T> {
  /**
   * @example
   * ```js
   * ```
   */
  toJSON: () => ErrorObject
}

/**
 * Type of `errorHandler()`
 */
export type ErrorHandler = (error: unknown) => ErrorType

/**
 * Type of `parse()`
 */
export type Parse = <T>(
  value: T,
) => ReturnType<typeof parse<T, { loose: true }>>

export type { ErrorName, ErrorObject }

/**
 * Creates the error types and handler.
 *
 * @example
 * ```js
 * export const {
 *   errorHandler,
 *   InputError,
 *   AuthError,
 *   DatabaseError,
 * } = modernErrors()
 * ```
 */
export default function modernErrors<T extends ErrorParams = ErrorParams>(
  options?: Options<T>,
): Result<T>
