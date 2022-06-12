import { ErrorName, OnCreate, ErrorType } from 'error-type'

/**
 *
 * @example
 * ```js
 * ```
 */
export default function modernErrors(options?: Options): Result

/**
 *
 */
export interface Options {
  bugsUrl?: string | URL
  onCreate?: OnCreate
}

/**
 *
 */
export type Result = { errorHandler: ErrorHandler } & {
  [errorName in ErrorName]: ErrorType
}

/**
 *
 */
export type ErrorHandler = (error: any) => Error

/**
 *
 */
export type { ErrorName }

/**
 *
 */
export type { OnCreate }

/**
 *
 */
export type { ErrorType }
