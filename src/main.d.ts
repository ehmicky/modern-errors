import {
  ErrorName,
  ErrorConstructor as RawErrorConstructor,
  ErrorInstance as RawErrorInstance,
  ErrorParams,
  Options as CreateErrorTypesOptions,
} from 'create-error-types'
import { serialize, parse, ErrorObject } from 'error-serializer'

/**
 * `modern-errors` options
 */
export interface Options<
  ErrorNames extends ErrorName = ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> {
  /**
   * URL where users should report internal errors/bugs.
   *
   * @example 'https://github.com/my-name/my-project/issues'
   */
  readonly bugsUrl?: CreateErrorTypesOptions['bugsUrl']

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
  readonly onCreate?: (
    error: ErrorInstance<ErrorNames>,
    params: Parameters<
      NonNullable<
        CreateErrorTypesOptions<ErrorNames, ErrorParamsArg>['onCreate']
      >
    >[1],
  ) => ReturnType<
    NonNullable<CreateErrorTypesOptions<ErrorNames, ErrorParamsArg>['onCreate']>
  >
}

/**
 * Any error type can be retrieved from the return value.
 * For example, `InputError`, `AuthError`, etc.
 *
 * @example
 * ```js
 * export const {
 *   errorHandler,
 *   parse,
 *   InputError,
 *   AuthError,
 *   DatabaseError,
 * } = modernErrors()
 * ```
 */
export type Result<
  ErrorNames extends ErrorName = ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> = {
  [errorName in ErrorNames]: ErrorConstructor<errorName, ErrorParamsArg>
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
  errorHandler: ErrorHandler<ErrorNames>

  /**
   * Convert an error plain object into an Error instance.
   *
   * @example
   * ```js
   * try {
   *   await readFile(filePath)
   * } catch (cause) {
   *   const error = new InputError('Could not read the file.', {
   *     cause,
   *     filePath: '/path',
   *   })
   *   const errorObject = error.toJSON()
   *   // {
   *   //   name: 'InputError',
   *   //   message: 'Could not read the file',
   *   //   stack: '...',
   *   //   cause: { name: 'Error', ... },
   *   //   filePath: '/path'
   *   // }
   *   const errorString = JSON.stringify(error)
   *   // '{"name":"InputError",...}'
   *   const newErrorObject = JSON.parse(errorString)
   *   const newError = parse(newErrorObject)
   *   // InputError: Could not read the file.
   *   //   filePath: '/path'
   *   //   [cause]: Error: ...
   * }
   * ```
   */
  parse: Parse
}

export type ErrorConstructor<
  ErrorNames extends ErrorName = ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> = new (
  ...args: ConstructorParameters<
    RawErrorConstructor<ErrorNames, ErrorParamsArg>
  >
) => ErrorInstance<ErrorNames>

export type ErrorInstance<ErrorNames extends ErrorName = ErrorName> =
  RawErrorInstance<ErrorNames> & {
    /**
     * Convert errors to plain objects that are
     * [always safe](https://github.com/ehmicky/error-serializer#json-safety) to
     * serialize with JSON
     * ([or YAML](https://github.com/ehmicky/error-serializer#custom-serializationparsing),
     * etc.). All error properties
     * [are kept](https://github.com/ehmicky/error-serializer#additional-error-properties),
     * including
     * [`cause`](https://github.com/ehmicky/error-serializer#errorcause-and-aggregateerror).
     *
     * @example
     * ```js
     * try {
     *   await readFile(filePath)
     * } catch (cause) {
     *   const error = new InputError('Could not read the file.', {
     *     cause,
     *     filePath: '/path',
     *   })
     *   const errorObject = error.toJSON()
     *   // {
     *   //   name: 'InputError',
     *   //   message: 'Could not read the file',
     *   //   stack: '...',
     *   //   cause: { name: 'Error', ... },
     *   //   filePath: '/path'
     *   // }
     *   const errorString = JSON.stringify(error)
     *   // '{"name":"InputError",...}'
     * }
     * ```
     */
    toJSON: () => ReturnType<typeof serialize<RawErrorInstance<ErrorNames>>>
  }

/**
 * Type of `errorHandler()`
 */
export type ErrorHandler<ErrorNames extends ErrorName = ErrorName> = (
  error: unknown,
) => ErrorInstance<ErrorNames>

/**
 * Type of `parse()`
 */
export type Parse = <ArgType>(
  value: ArgType,
) => ReturnType<typeof parse<ArgType, { loose: true }>>

export type { ErrorName, ErrorObject, ErrorParams }

/**
 * Creates custom error types.
 *
 * @example
 * ```js
 * export const {
 *   errorHandler,
 *   parse,
 *   InputError,
 *   AuthError,
 *   DatabaseError,
 * } = modernErrors()
 * ```
 */
export default function modernErrors<
  ErrorParamsArg extends ErrorParams = ErrorParams,
  ErrorNames extends ErrorName[] = [],
>(
  errorNames: ErrorNames,
  options?: Options<ErrorNames[number], ErrorParamsArg>,
): Result<ErrorNames[number], ErrorParamsArg>
