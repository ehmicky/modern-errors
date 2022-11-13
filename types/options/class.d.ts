import type { ErrorProps } from '../plugins/core/props/main.js'
import type { Plugins } from '../plugins/shape.js'
import type { CustomClass } from '../subclass/custom/main.js'
import type { PluginsOptions } from './plugins.js'

/**
 * Class-specific options, excluding plugin options
 */
interface KnownClassOptions<
  ChildPlugins extends Plugins,
  ChildCustomClass extends CustomClass,
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
   *   // The `class` must extend from the parent error class
   *   custom: class extends BaseError {
   *     // If a `constructor` is defined, its parameters must be (message, options)
   *     constructor(message, options) {
   *       message += message.endsWith('.') ? '' : '.'
   *       super(message, options)
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
  ChildCustomClass extends CustomClass,
> = KnownClassOptions<ChildPlugins, ChildCustomClass> &
  PluginsOptions<[...PluginsArg, ...ChildPlugins], ChildProps>

/**
 * Class-specific options passed to `ErrorClass.subclass('ErrorName', options)`
 */
export type ClassOptions<PluginsArg extends Plugins = Plugins> =
  SpecificClassOptions<PluginsArg, PluginsArg, ErrorProps, CustomClass>
