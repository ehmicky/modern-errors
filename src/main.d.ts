import { ErrorName, OnCreate, ErrorType, ErrorParams } from 'error-type'

export interface Options<T extends ErrorParams = ErrorParams> {
  bugsUrl?: string | URL
  onCreate?: OnCreate<T>
}

export type Result<T extends ErrorParams = ErrorParams> = {
  [errorName in ErrorName]: ErrorType<T>
} & { errorHandler: ErrorHandler }

export type ErrorHandler = (error: unknown) => Error

export type { ErrorName, OnCreate, ErrorType }

/**
 *
 * @example
 * ```js
 * ```
 */
export default function modernErrors<T extends ErrorParams = ErrorParams>(
  options?: Options<T>,
): Result<T>
