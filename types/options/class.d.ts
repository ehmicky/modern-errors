import type { Plugins } from '../plugins/shape.js'
import type { ErrorProps } from '../core_plugins/props/main.js'
import type { CustomAttributes } from '../subclass/custom/main.js'
import type { SpecificErrorClass } from '../subclass/main/main.js'
import type { ErrorConstructor } from '../subclass/parent/main.js'
import type { PluginsOptions } from './plugins.js'

/**
 * Matches any class passed to the `custom` option
 */
type BareConstructor = new (...args: any[]) => any

/**
 * When any class extends from its parent, TypeScript instantiates the generics
 * of its parent `constructor` with their default types.
 * This implements the same logic so that the `custom` option can match the
 * class passed to it.
 */
type NonGenericConstructor<ConstructorArg extends BareConstructor> = {
  new (
    ...args: ConstructorParameters<ConstructorArg>
  ): InstanceType<ConstructorArg>
} & { [Key in keyof ConstructorArg]: ConstructorArg[Key] }

/**
 * Class-specific options, excluding plugin options
 */
interface KnownClassOptions<
  ParentPlugins extends Plugins,
  PluginsArg extends Plugins,
  ParentProps extends ErrorProps,
  ParentErrorClass extends ErrorConstructor,
  CustomAttributesArg extends CustomAttributes,
  CustomClass extends ErrorConstructor,
  // TODO: fix
  // NonGenericConstructor<
  //   SpecificErrorClass<
  //     ParentPlugins,
  //     ParentProps,
  //     ParentErrorClass,
  //     CustomAttributesArg
  //   >
  // >,
> {
  readonly plugins?: PluginsArg

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
  readonly custom?: CustomClass
}

/**
 * Class-specific options, used internally only with additional generics
 */
export type SpecificClassOptions<
  ParentPlugins extends Plugins,
  PluginsArg extends Plugins,
  ParentProps extends ErrorProps,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor,
  CustomClass extends ErrorConstructor,
  CustomAttributesArg extends CustomAttributes,
> = KnownClassOptions<
  ParentPlugins,
  PluginsArg,
  ParentProps,
  ParentErrorClass,
  CustomAttributesArg,
  CustomClass
> &
  PluginsOptions<PluginsArg, ErrorPropsArg>

/**
 * Class-specific options passed to `BaseError.subclass('ErrorName', options)` or
 * `ErrorClass.subclass('ErrorName', options)`
 */
export type ClassOptions<PluginsArg extends Plugins = []> =
  SpecificClassOptions<
    PluginsArg,
    PluginsArg,
    ErrorProps,
    ErrorProps,
    ErrorConstructor,
    ErrorConstructor,
    CustomAttributes
  >
