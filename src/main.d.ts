import { ErrorName, OnCreate, ErrorType, ErrorParams } from 'error-type'

export interface Options<T extends ErrorParams = ErrorParams> {
  /**
   * URL where users should report system errors/bugs.
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
  [errorName in ErrorName]: ErrorType<T>
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
}

export type ErrorHandler = (error: unknown) => Error

export type { ErrorName, OnCreate, ErrorType }

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
