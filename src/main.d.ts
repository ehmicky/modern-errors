import {
  ErrorName,
  OnCreate as RawOnCreate,
  ErrorConstructor as RawErrorConstructor,
  ErrorInstance as RawErrorInstance,
  ErrorParams,
  Options as CreateErrorTypesOptions,
} from 'create-error-types'
import { serialize, parse, ErrorObject } from 'error-serializer'

export interface Options<
  ErrorNamesArg extends ErrorName = ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> {
  readonly bugsUrl?: CreateErrorTypesOptions['bugsUrl']

  readonly onCreate?: OnCreate<ErrorNamesArg, ErrorParamsArg>
}

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
export type OnCreate<
  ErrorNamesArg extends ErrorName = ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> = (
  error: ErrorInstance<ErrorNamesArg>,
  params: Parameters<RawOnCreate<ErrorNamesArg, ErrorParamsArg>>[1],
) => ReturnType<RawOnCreate<ErrorNamesArg, ErrorParamsArg>>

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
export type Result<
  ErrorNamesArg extends ErrorName = ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> = {
  [errorName in ErrorNamesArg]: ErrorConstructor<errorName, ErrorParamsArg>
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
  errorHandler: ErrorHandler<ErrorNamesArg>

  /**
   * @example
   * ```js
   * ```
   */
  parse: Parse
}

export type ErrorConstructor<
  ErrorNamesArg extends ErrorName = ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> = new (
  ...args: ConstructorParameters<
    RawErrorConstructor<ErrorNamesArg, ErrorParamsArg>
  >
) => ErrorInstance<ErrorNamesArg>

export type ErrorInstance<ErrorNamesArg extends ErrorName = ErrorName> =
  RawErrorInstance<ErrorNamesArg> & {
    /**
     * @example
     * ```js
     * ```
     */
    toJSON: () => ReturnType<typeof serialize<RawErrorInstance<ErrorNamesArg>>>
  }

/**
 * Type of `errorHandler()`
 */
export type ErrorHandler<ErrorNamesArg extends ErrorName = ErrorName> = (
  error: unknown,
) => ErrorInstance<ErrorNamesArg>

/**
 * Type of `parse()`
 */
export type Parse = <ArgType>(
  value: ArgType,
) => ReturnType<typeof parse<ArgType, { loose: true }>>

export type { ErrorName, ErrorObject, ErrorParams }

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
export default function modernErrors<
  ErrorNamesArg extends ErrorName = ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
>(
  options?: Options<ErrorNamesArg, ErrorParamsArg>,
): Result<ErrorNamesArg, ErrorParamsArg>
