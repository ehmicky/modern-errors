import type { Plugins } from '../plugins/shape.js'
import type { PluginsStaticMethods } from '../plugins/static.js'
import type { ErrorProps, MergeErrorProps } from '../core_plugins/props/main.js'
import type { NoAdditionalProps } from '../utils.js'
import type { CustomAttributes } from '../subclass/custom/main.js'
import type { CustomStaticAttributes } from '../subclass/inherited.js'
import type { CreateSubclass } from '../subclass/main/main.js'
import type {
  ErrorConstructor,
  ParentInstanceOptions,
  ParentExtra,
} from '../subclass/parent/main.js'
import type { BaseErrorInstance, NormalizeError } from './normalize/main.js'

interface BaseErrorClassCore<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  CustomAttributesArg extends CustomAttributes,
> {
  /**
   * Base error class.
   *
   * @example
   * ```js
   * try {
   *   throw new AuthError('...')
   * } catch (cause) {
   *   // Still an AuthError
   *   throw new BaseError('...', { cause })
   * }
   * ```
   */
  new <
    InstanceOptionsArg extends ParentInstanceOptions<
      PluginsArg,
      ParentErrorClass
    > = {},
  >(
    message: string,
    options?: NoAdditionalProps<
      InstanceOptionsArg,
      ParentInstanceOptions<PluginsArg, ParentErrorClass>
    >,
    ...extra: ParentExtra<PluginsArg, ParentErrorClass>
  ): BaseErrorInstance<
    PluginsArg,
    MergeErrorProps<ErrorPropsArg, InstanceOptionsArg>,
    InstanceOptionsArg['cause'],
    InstanceOptionsArg
  >

  readonly prototype: InstanceType<
    SpecificBaseErrorClass<
      PluginsArg,
      ErrorPropsArg,
      ParentErrorClass,
      CustomAttributesArg
    >
  >

  /**
   * Creates and returns an error subclass.
   * The first one must be named `UnknownError`.
   * Subclasses can also call `ErrorClass.subclass()` themselves.
   *
   * @example
   * ```js
   * export const InputError = BaseError.subclass('InputError', options)
   * ```
   */
  readonly subclass: CreateSubclass<
    PluginsArg,
    ErrorPropsArg,
    ParentErrorClass,
    CustomAttributesArg
  >

  /**
   * Normalizes invalid errors and assigns the `UnknownError` class to
   * _unknown_ errors.
   *
   * @example
   * ```js
   * try {
   *   throw 'Missing file path.'
   * } catch (error) {
   *   // Normalized from a string to an `Error` instance
   *   throw BaseError.normalize(error)
   * }
   * ```
   */
  normalize<ErrorArg extends unknown>(
    error: ErrorArg,
  ): NormalizeError<PluginsArg, ErrorPropsArg, ErrorArg>
}

/**
 * Base error class `BaseError`, used internally only with additional generics
 */
export type SpecificBaseErrorClass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  CustomAttributesArg extends CustomAttributes,
> = BaseErrorClassCore<
  PluginsArg,
  ErrorPropsArg,
  ParentErrorClass,
  CustomAttributesArg
> &
  CustomStaticAttributes<
    PluginsArg,
    ParentErrorClass,
    keyof BaseErrorClassCore<
      PluginsArg,
      ErrorPropsArg,
      ParentErrorClass,
      CustomAttributesArg
    >
  > &
  PluginsStaticMethods<PluginsArg>

/**
 * Base error class `BaseError`
 */
export type BaseErrorClass<PluginsArg extends Plugins = []> =
  SpecificBaseErrorClass<
    PluginsArg,
    ErrorProps,
    ErrorConstructor<PluginsArg>,
    CustomAttributes
  >
