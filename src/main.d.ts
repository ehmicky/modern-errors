import { ErrorName, OnCreate, ErrorType } from 'error-type'

/**
 *
 * @example
 * ```js
 * ```
 */
export default function modernErrors(options?: Options): Result

export interface Options {
  bugsUrl?: string | URL
  onCreate?: OnCreate
}

export type Result = { [errorName in ErrorName]: ErrorType } & {
  errorHandler: ErrorHandler
}

export type ErrorHandler = (error: unknown) => Error

export type { ErrorName, OnCreate, ErrorType }
