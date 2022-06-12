import { OnCreate } from 'error-type'

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

export interface Result {}
