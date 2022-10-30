import type { GetOptions, IsOptions } from '../options/get.js'
import type { StaticMethods } from './static.js'
import type { InstanceMethods } from './instance.js'
import type { GetProperties } from './properties.js'

/**
 * Plugins extend `modern-errors` features.
 *
 * @example
 * ```js
 * import modernErrorsBugs from 'modern-errors-bugs'
 * import modernErrorsSerialize from 'modern-errors-serialize'
 *
 * export const AnyError = modernErrors([modernErrorsBugs, modernErrorsSerialize])
 * ```
 */
export interface Plugin {
  /**
   *
   */
  readonly name: string

  /**
   *
   */
  readonly getOptions?: GetOptions

  /**
   *
   */
  readonly isOptions?: IsOptions

  /**
   *
   */
  readonly instanceMethods?: InstanceMethods

  /**
   *
   */
  readonly staticMethods?: StaticMethods

  /**
   *
   */
  readonly properties?: GetProperties
}

export type Plugins = readonly Plugin[]
