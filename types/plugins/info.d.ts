import type { ErrorName } from 'error-custom-class'
import type { AnyErrorClass } from '../any/main.js'
import type { ErrorClass } from '../subclass/main/main.js'
import type { ErrorInstance } from '../any/modify/main.js'
import type { Plugins } from './shape.js'

/**
 * Properties shared by all `info` objects.
 */
interface CommonInfo {
  /**
   * Normalized error instance.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   properties({ error }) {
   *     return { isInputError: error.name === 'InputError' }
   *   },
   * }
   * ```
   */
  error: ErrorInstance

  /**
   * Plugin's options, as returned by `getOptions()`.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   getOptions(options) {
   *     return options
   *   },
   *   // `new ErrorClass('message', { example: value })` sets `error.example: value`
   *   properties({ options }) {
   *     return { example: options }
   *   },
   * }
   * ```
   */
  readonly options: never

  /**
   * Hints whether `error.stack` should be printed or not.
   *
   * This is `true` if the error (or one of its inner errors) is _unknown_, and
   * `false` otherwise.
   *
   * If a plugin prints `error.stack` optionally, `showStack` can be used as the
   * default value of a `stack` boolean option. This allows users to decide
   * whether to print `error.stack` or not, while still providing with a good
   * default behavior.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   getOptions(options) {
   *     // ...
   *   },
   *   instanceMethods: {
   *     log({ error, showStack, options: { stack = showStack } }) {
   *       console.log(stack ? error.stack : error.message)
   *     },
   *   },
   * }
   * ```
   */
  readonly showStack: boolean

  /**
   * Reference to `AnyError`. This can be used to call `AnyError.normalize()` or
   * `error instanceof AnyError`.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   instanceMethods: {
   *     addErrors({ error, AnyError }, errors = []) {
   *       error.errors = errors.map(AnyError.normalize)
   *     },
   *   },
   * }
   * ```
   */
  readonly AnyError: AnyErrorClass<Plugins>

  /**
   * Object with all error classes created with `AnyError.subclass()` or
   * `ErrorClass.subclass()`.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   staticMethods: {
   *     isKnownErrorClass({ ErrorClasses }, value) {
   *       return Object.values(ErrorClasses).includes(value)
   *     },
   *   },
   * }
   * ```
   */
  readonly ErrorClasses: {
    AnyError: never
    UnknownError: ErrorClass
    [name: ErrorName]: ErrorClass
  }

  /**
   * Returns the `info` object from a specific `Error`, except from
   * `info.AnyError`, `info.ErrorClasses` and `info.errorInfo`.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   staticMethods: {
   *     getLogErrors({ errorInfo }) {
   *       return function logErrors(errors) {
   *         errors.forEach((error) => {
   *           const { showStack } = errorInfo(error)
   *           console.log(showStack ? error.stack : error.message)
   *         })
   *       }
   *     },
   *   },
   * }
   * ```
   */
  readonly errorInfo: (error: unknown) => Info['errorInfo']
}

/**
 * `info` is a plain object passed as the first argument to `properties()`,
 * instance methods and static methods.
 *
 * Its members are readonly and should not be mutated, except for `info.error`
 * inside instance methods (not inside `properties()`).
 */
export interface Info {
  /**
   * `info` object passed to `plugin.properties()`
   */
  readonly properties: CommonInfo

  /**
   * `info` object passed to `plugin.instanceMethods.*()`
   */
  readonly instanceMethods: CommonInfo

  /**
   * `info` object passed to `plugin.staticMethods.*()`
   */
  readonly staticMethods: Omit<CommonInfo, 'error' | 'showStack'>

  /**
   * `info` object returned by `errorInfo()`
   */
  readonly errorInfo: Omit<
    CommonInfo,
    'AnyError' | 'ErrorClasses' | 'errorInfo'
  >
}
