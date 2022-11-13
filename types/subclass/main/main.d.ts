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

interface ErrorSubclassCore<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomClass extends ErrorConstructor,
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
    ChildProps extends ErrorProps = ErrorProps,
    AggregateErrorsArg extends AggregateErrors = AggregateErrors,
    CauseArg extends Cause = Cause,
  >(
    message: string,
    options?: ParentInstanceOptions<
      PluginsArg,
      ChildProps,
      CustomClass,
      AggregateErrorsArg,
      CauseArg
    >,
    ...extra: ParentExtra<CustomClass>
  ): SpecificErrorInstance<
    PluginsArg,
    MergeErrorProps<ErrorPropsArg, ChildProps>,
    CustomClass,
    AggregateErrorsArg,
    CauseArg
  >

  readonly prototype: InstanceType<
    ErrorSubclassCore<PluginsArg, ErrorPropsArg, CustomClass>
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
    ChildPlugins extends Plugins = [],
    ChildCustomClass extends CustomClass = CustomClass,
    ChildProps extends ErrorProps = {},
  >(
    errorName: ErrorName,
    options?: SpecificClassOptions<
      PluginsArg,
      ChildPlugins,
      ChildProps,
      ChildCustomClass
    >,
  ): SpecificErrorClass<
    [...PluginsArg, ...ChildPlugins],
    MergeErrorProps<ErrorPropsArg, ChildProps>,
    ChildCustomClass
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
  ): NormalizeError<PluginsArg, ErrorPropsArg, ErrorArg, CustomClass>
}

/**
 * Error class, with specific `props`, `custom`, etc.
 */
export type SpecificErrorClass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomClass extends ErrorConstructor,
> = ErrorSubclassCore<PluginsArg, ErrorPropsArg, CustomClass> &
  OmitKeys<
    CustomClass,
    keyof ErrorSubclassCore<PluginsArg, ErrorPropsArg, CustomClass>
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
