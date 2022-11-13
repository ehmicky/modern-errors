import type { ErrorName } from 'error-custom-class'

import type { PluginsStaticMethods } from '../../plugins/static.js'
import type { Plugins } from '../../plugins/shape.js'
import type { AggregateErrors } from '../../base/aggregate.js'
import type { SpecificErrorInstance } from '../../base/modify/main.js'
import type { NormalizeError } from '../../base/normalize/main.js'
import type {
  ErrorProps,
  MergeErrorProps,
} from '../../core_plugins/props/main.js'
import type { SpecificClassOptions } from '../../options/class.js'
import type { Cause } from '../../options/instance.js'
import type { OmitKeys } from '../../utils.js'
import type {
  ErrorConstructor,
  ParentInstanceOptions,
  ParentExtra,
} from '../parent/main.js'

/**
 * Return value of `ErrorClass.subclass()`
 */
export type ErrorSubclass<
  PluginsArg extends Plugins,
  ParentProps extends ErrorProps,
  ErrorPropsArg extends ErrorProps,
  ParentCustomClass extends ErrorConstructor,
> = SpecificErrorClass<
  PluginsArg,
  MergeErrorProps<ParentProps, ErrorPropsArg>,
  ParentCustomClass
>

interface ErrorSubclassCore<
  ParentPlugins extends Plugins,
  ParentProps extends ErrorProps,
  ParentCustomClass extends ErrorConstructor,
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
    ErrorPropsArg extends ErrorProps = ErrorProps,
    AggregateErrorsArg extends AggregateErrors = AggregateErrors,
    CauseArg extends Cause = Cause,
  >(
    message: string,
    options?: ParentInstanceOptions<
      ParentPlugins,
      ErrorPropsArg,
      ParentCustomClass,
      AggregateErrorsArg,
      CauseArg
    >,
    ...extra: ParentExtra<ParentCustomClass>
  ): SpecificErrorInstance<
    ParentPlugins,
    MergeErrorProps<ParentProps, ErrorPropsArg>,
    ParentCustomClass,
    AggregateErrorsArg,
    CauseArg
  >

  readonly prototype: InstanceType<
    ErrorSubclassCore<ParentPlugins, ParentProps, ParentCustomClass>
  >

  /**
   * Creates and returns an error subclass.
   *
   * @example
   * ```js
   * export const InputError = ErrorClass.subclass('InputError', options)
   * ```
   */
  subclass<
    PluginsArg extends Plugins = [],
    CustomClass extends ErrorConstructor = ParentCustomClass,
    ErrorPropsArg extends ErrorProps = {},
  >(
    errorName: ErrorName,
    options?: SpecificClassOptions<
      ParentPlugins,
      PluginsArg,
      ParentProps,
      ErrorPropsArg,
      ParentCustomClass,
      CustomClass
    >,
  ): ErrorSubclass<ParentPlugins, ParentProps, ErrorPropsArg, CustomClass>

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
  ): NormalizeError<ParentPlugins, ParentProps, ErrorArg, ParentCustomClass>
}

/**
 * Error class, with specific `props`, `custom`, etc.
 */
export type SpecificErrorClass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentCustomClass extends ErrorConstructor,
> = ErrorSubclassCore<PluginsArg, ErrorPropsArg, ParentCustomClass> &
  OmitKeys<
    ParentCustomClass,
    keyof ErrorSubclassCore<PluginsArg, ErrorPropsArg, ParentCustomClass>
  > &
  PluginsStaticMethods<PluginsArg>

/**
 * Error class
 */
export type ErrorClass<PluginsArg extends Plugins = []> = SpecificErrorClass<
  PluginsArg,
  ErrorProps,
  ErrorConstructor
>
