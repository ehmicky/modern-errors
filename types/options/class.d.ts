import type { Plugins } from '../plugins/shape.js'
import type { ErrorProps } from '../core_plugins/props/main.js'
import type { ErrorConstructor } from '../subclass/parent/main.js'
import type { PluginsOptions } from './plugins.js'

/**
 * Class-specific options, excluding plugin options
 */
interface KnownClassOptions<
  ChildPlugins extends Plugins,
  ChildCustomClass extends ErrorConstructor,
> {
  /**
   * Plugins to add.
   *
   * @example
   * ```js
   * import modernErrorsBugs from 'modern-errors-bugs'
   * import modernErrorsSerialize from 'modern-errors-serialize'
   *
   * export const BaseError = ModernError.subclass('BaseError', {
   *   plugins: [modernErrorsBugs, modernErrorsSerialize],
   * })
   * ```
   */
  readonly plugins?: ChildPlugins

  /**
   * Custom class to add any methods, `constructor` or properties.
   *
   * @example
   * ```js
   * export const InputError = BaseError.subclass('InputError', {
   *   // The `class` must extend from `BaseError`
   *   custom: class extends BaseError {
   *     // If a `constructor` is defined, its parameters must be (message, options)
   *     // like `BaseError`
   *     constructor(message, options) {
   *       // Modifying `message` or `options` should be done before `super()`
   *       message += message.endsWith('.') ? '' : '.'
   *
   *       // All arguments should be forwarded to `super()`, including any
   *       // custom `options` or additional `constructor` parameters
   *       super(message, options)
   *
   *       // `name` is automatically added, so this is not necessary
   *       // this.name = 'InputError'
   *     }
   *
   *     isUserInput() {
   *       // ...
   *     }
   *   },
   * })
   *
   * const error = new InputError('Wrong user name')
   * console.log(error.message) // 'Wrong user name.'
   * console.log(error.isUserInput())
   * ```
   */
  readonly custom?: ChildCustomClass
}

/**
 * Class-specific options, used internally only with additional generics
 */
export type SpecificClassOptions<
  PluginsArg extends Plugins,
  ChildPlugins extends Plugins,
  ChildProps extends ErrorProps,
  ChildCustomClass extends ErrorConstructor,
> = KnownClassOptions<ChildPlugins, ChildCustomClass> &
  PluginsOptions<[...PluginsArg, ...ChildPlugins], ChildProps>

/**
 * Class-specific options passed to `BaseError.subclass('ErrorName', options)` or
 * `ErrorClass.subclass('ErrorName', options)`
 */
export type ClassOptions<PluginsArg extends Plugins = []> =
  SpecificClassOptions<PluginsArg, PluginsArg, ErrorProps, ErrorConstructor>
