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
 *   // Add instance methods like `ErrorClass.exampleMethod(error, ...args)` or
 *   // `error.exampleMethod(...args)`
 *   instanceMethods: {
 *     exampleMethod(info, ...args) {
 *       // ...
 *     },
 *   },
 *
 *   // Add static methods like `ErrorClass.staticMethod(...args)`
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
   * // `ErrorClass.exampleMethod(error, 'one', true)` results in:
   * //   options: true
   * //   args: ['one']
   * // `ErrorClass.exampleMethod(error, 'one', 'two')` results in:
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
   * Add error instance methods like `ErrorClass.methodName(error, ...args)` or
   * `error.methodName(...args)`. Unlike static methods, this should be used
   * when the method's main argument is an `error` instance.
   *
   * The first argument `info` is provided by `modern-errors`. The `error`
   * argument is passed as `info.error`. The other `...args` are forwarded from
   * the method's call.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   // `ErrorClass.concatMessage(error, "one")` or `error.concatMessage("one")`
   *   // return `${error.message} - one`
   *   instanceMethods: {
   *     concatMessage(info, string) {
   *       return `${info.error.message} - ${string}`
   *     },
   *   },
   * }
   * ```
   */
  readonly instanceMethods?: InstanceMethods

  /**
   * Add error static methods like `ErrorClass.methodName(...args)`. Unlike
   * instance methods, this should be used when the method's main argument is
   * _not_ an `error` instance.
   *
   * The first argument `info` is provided by `modern-errors`. `info.error` is
   * not defined. The other `...args` are forwarded from the method's call.
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
