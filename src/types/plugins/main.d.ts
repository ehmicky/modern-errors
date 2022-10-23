import type { ErrorName } from 'error-custom-class'
import type { AnyErrorClass } from '../any.js'
import type { ErrorClass } from '../class.js'
import type { ErrorInstance } from '../instance.js'
import type { StaticMethods } from './static.js'
import type { InstanceMethods } from './instance.js'

/**
 *
 */
interface CommonInfo {
  /**
   *
   */
  error: ErrorInstance

  /**
   *
   */
  readonly options: never

  /**
   *
   */
  readonly showStack: boolean

  /**
   *
   */
  readonly AnyError: AnyErrorClass<Plugins>

  /**
   *
   */
  readonly ErrorClasses: {
    AnyError: never
    UnknownError: ErrorClass
    [name: ErrorName]: ErrorClass
  }

  /**
   *
   */
  readonly errorInfo: (error: unknown) => Info['errorInfo']
}

/**
 *
 */
export interface Info {
  /**
   *
   */
  readonly properties: CommonInfo

  /**
   *
   */
  readonly instanceMethods: CommonInfo

  /**
   *
   */
  readonly staticMethods: Omit<CommonInfo, 'error' | 'showStack'>

  /**
   *
   */
  readonly errorInfo: Omit<
    CommonInfo,
    'AnyError' | 'ErrorClasses' | 'errorInfo'
  >
}

type GetOptions = (input: never, full: boolean) => unknown

type IsOptions = (input: unknown) => boolean

export type GetProperties = (info: Info['properties']) => {
  [PropName: string]: unknown
}

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
