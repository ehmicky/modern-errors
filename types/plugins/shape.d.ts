import type { GetOptions, IsOptions } from '../options/get.js'
import type { InstanceMethods } from './instance.js'
import type { GetProperties } from './properties.js'
import type { StaticMethods } from './static.js'

/**
 * Plugins extend `modern-errors` features.
 *
 * @example
 * ```js
 * export default {
 *   // Name used to configure the plugin
 *   name: 'example',
 *
 *   // Set error properties
 *   properties(info) {
 *     return {}
 *   },
 *
 *   // Add error instance methods like `error.exampleMethod(...args)`
 *   instanceMethods: {
 *     exampleMethod(info, ...args) {
 *       // ...
 *     },
 *   },
 *
 *   // Add `ErrorClass` static methods like `ErrorClass.staticMethod(...args)`
 *   staticMethods: {
 *     staticMethod(info, ...args) {
 *       // ...
 *     },
 *   },
 *
 *   // Validate and normalize options
 *   getOptions(options, full) {
 *     return options
 *   },
 *
 *   // Determine if a value is plugin's options
 *   isOptions(options) {
 *     return typeof options === 'boolean'
 *   },
 * }
 * ```
 */
export interface Plugin {
  /**
   * Plugin's name. It is used to configure the plugin's options.
   *
   * Only lowercase letters must be used (as opposed to `_` `-` `.` or uppercase
   * letters).
   *
   * @example
   * ```js
   * // Users configure this plugin using
   * // `ErrorClass.subclass('ErrorName', { example: ... })`
   * // or `new ErrorClass('...', { example: ... })
   * export default {
   *   name: 'example',
   * }
   * ```
   */
  readonly name: string

  /**
   * Normalize and return the plugin's `options`.
   * Required to use plugin `options`.
   *
   * If `options` are invalid, an `Error` should be thrown. The error message is
   * automatically prepended with `Invalid "${plugin.name}" options:`. Regular
   * [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)s
   * should be thrown, as opposed to using `modern-errors` itself.
   *
   * The plugin's `options` can have any type.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   getOptions(options = true) {
   *     if (typeof options !== 'boolean') {
   *       throw new Error('It must be true or false.')
   *     }
   *
   *     return options
   *   },
   * }
   * ```
   */
  readonly getOptions?: GetOptions

  /**
   * Plugin users can pass the plugin's `options` as the last argument of any
   * plugin method (instance or static). `isOptions()` determines whether the
   * last argument of a plugin method are `options` or not.
   * This should be defined if the plugin has any method with arguments.
   *
   * If `options` are invalid but can be determined not to be the last argument
   * of any plugin's method, `isOptions()` should still return `true`. This
   * allows `getOptions()` to validate them and throw proper error messages.
   *
   * @example
   * ```js
   * // `error.exampleMethod('one', true)` results in:
   * //   options: true
   * //   args: ['one']
   * // `error.exampleMethod('one', 'two')` results in:
   * //   options: undefined
   * //   args: ['one', 'two']
   * export default {
   *   name: 'example',
   *   isOptions(options) {
   *     return typeof options === 'boolean'
   *   },
   *   getOptions(options) {
   *     return options
   *   },
   *   instanceMethod: {
   *     exampleMethod({ options }, ...args) {
   *       // ...
   *     },
   *   },
   * }
   * ```
   */
  readonly isOptions?: IsOptions

  /**
   * Add error instance methods like `error.methodName(...args)`.
   *
   * The first argument `info` is provided by `modern-errors`.
   * The other `...args` are forwarded from the method's call.
   *
   * If the logic involves an `error` instance or error-specific `options`,
   * instance methods should be preferred over static methods.
   * Otherwise, static methods should be used.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   // `error.concatMessage("one")` returns `${error.message} - one`
   *   instanceMethods: {
   *     concatMessage({ error }, string) {
   *       return `${error.message} - ${string}`
   *     },
   *   },
   * }
   * ```
   */
  readonly instanceMethods?: InstanceMethods

  /**
   * Add error static methods like `ErrorClass.methodName(...args)`.
   *
   * The first argument `info` is provided by `modern-errors`.
   * The other `...args` are forwarded from the method's call.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   // `ErrorClass.multiply(2, 3)` returns `6`
   *   staticMethods: {
   *     multiply(info, first, second) {
   *       return first * second
   *     },
   *   },
   * }
   * ```
   */
  readonly staticMethods?: StaticMethods

  /**
   * Set properties on `error.*` (including `message` or `stack`).
   * The properties to set must be returned as an object.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   // Sets `error.example: true`
   *   properties() {
   *     return { example: true }
   *   },
   * }
   * ```
   */
  readonly properties?: GetProperties
}

/**
 * List of plugins
 */
export type Plugins = readonly Plugin[]
