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
import type { GetAggregateErrors } from './aggregate.js'
import { MainInstanceOptions } from '../options/instance.js'

interface BaseErrorClassCore<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  CustomAttributesArg extends CustomAttributes,
> {
  /**
   * Error subclass
   *
   * @example
   * ```js
   * throw new InputError('Missing file path.')
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
    CustomAttributesArg,
    GetAggregateErrors<InstanceOptionsArg>
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
  ): NormalizeError<
    PluginsArg,
    ErrorPropsArg,
    ErrorArg,
    CustomAttributesArg,
    GetAggregateErrors<MainInstanceOptions>
  >
}

/**
 * Error class, with specific `props`, `custom`, etc.
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
 * Error class
 */
export type BaseErrorClass<PluginsArg extends Plugins = []> =
  SpecificBaseErrorClass<
    PluginsArg,
    ErrorProps,
    ErrorConstructor<PluginsArg>,
    CustomAttributes
  >
