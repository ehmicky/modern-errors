import type { ErrorName } from 'error-custom-class'
import type { Plugins } from '../plugins/main.js'
import type { ErrorProps } from '../core_plugins/props.js'
import type { CustomAttributes } from '../subclass/custom.js'
import type { ErrorConstructor, ErrorSubclass } from '../subclass/main.js'
import type { PluginsOptions } from './plugins.js'

type BareConstructor = new (...args: any[]) => any

type NonGenericConstructor<ConstructorArg extends BareConstructor> = {
  new (
    ...args: ConstructorParameters<ConstructorArg>
  ): InstanceType<ConstructorArg>
} & { [Key in keyof ConstructorArg]: ConstructorArg[Key] }

/**
 * Class-specific options
 */
export type SpecificClassOptions<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  CustomAttributesArg extends CustomAttributes,
> = {
  /**
   * Custom class to add any methods, `constructor` or properties.
   *
   * @example
   * ```js
   * export const InputError = AnyError.subclass('InputError', {
   *   // The `class` must extend from `AnyError`
   *   custom: class extends AnyError {
   *     // If a `constructor` is defined, its parameters must be (message, options)
   *     // like `AnyError`
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
  readonly custom?: NonGenericConstructor<
    ErrorSubclass<
      PluginsArg,
      ErrorPropsArg,
      ParentErrorClass,
      CustomAttributesArg,
      ErrorName
    >
  >
} & PluginsOptions<PluginsArg>

/**
 *
 */
export type ClassOptions<PluginsArg extends Plugins = []> =
  SpecificClassOptions<
    PluginsArg,
    ErrorProps,
    ErrorConstructor<PluginsArg>,
    CustomAttributes
  >
