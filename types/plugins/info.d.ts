import type { ErrorName } from 'error-custom-class'
import type { AnyErrorClass } from '../any/main.js'
import type { ErrorClass } from '../subclass/main/main.js'
import type { ErrorInstance } from '../any/modify/main.js'
import type { Plugins } from './shape.js'

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
