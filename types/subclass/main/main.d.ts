import type { ErrorName } from 'error-custom-class'

import type { PluginsStaticMethods } from '../../plugins/static.js'
import type { Plugins } from '../../plugins/shape.js'
import type { AggregateErrors } from '../../base/aggregate.js'
import type { SpecificErrorInstance } from '../../base/cause/main.js'
import type { NormalizeError } from '../normalize/main.js'
import type {
  ErrorProps,
  MergeErrorProps,
} from '../../core_plugins/props/main.js'
import type { SpecificClassOptions } from '../../options/class.js'
import type { Cause } from '../../options/instance.js'
import type { OmitKeys } from '../../utils.js'
import type {
  CustomClass,
  ParentInstanceOptions,
  ParentExtra,
} from '../parent/main.js'

/**
 * `ErrorClass.subclass()`
 */
type CreateSubclass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomClassArg extends CustomClass,
> = <
  ChildPlugins extends Plugins = [],
  ChildCustomClass extends CustomClassArg = CustomClassArg,
  ChildProps extends ErrorProps = {},
>(
  errorName: ErrorName,
  options?: SpecificClassOptions<
    PluginsArg,
    ChildPlugins,
    ChildProps,
    ChildCustomClass
  >,
) => SpecificErrorClass<
  [...PluginsArg, ...ChildPlugins],
  MergeErrorProps<ErrorPropsArg, ChildProps>,
  ChildCustomClass
>

interface ErrorSubclassCore<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomClassArg extends CustomClass,
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
      CustomClassArg,
      AggregateErrorsArg,
      CauseArg
    >,
    ...extra: ParentExtra<CustomClassArg>
  ): SpecificErrorInstance<
    PluginsArg,
    MergeErrorProps<ErrorPropsArg, ChildProps>,
    CustomClassArg,
    AggregateErrorsArg,
    CauseArg
  >

  readonly prototype: InstanceType<
    ErrorSubclassCore<PluginsArg, ErrorPropsArg, CustomClassArg>
  >

  /**
   * Creates and returns an error subclass.
   *
   * @example
   * ```js
   * export const InputError = ErrorClass.subclass('InputError', options)
   * ```
   */
  subclass: CreateSubclass<PluginsArg, ErrorPropsArg, CustomClassArg>

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
  normalize: NormalizeError<PluginsArg, ErrorPropsArg, CustomClassArg>
}

/**
 * Error class, with specific `props`, `custom`, etc.
 */
export type SpecificErrorClass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomClassArg extends CustomClass,
> = ErrorSubclassCore<PluginsArg, ErrorPropsArg, CustomClassArg> &
  OmitKeys<
    CustomClassArg,
    keyof ErrorSubclassCore<PluginsArg, ErrorPropsArg, CustomClassArg>
  > &
  PluginsStaticMethods<PluginsArg>

/**
 * Error class
 */
export type ErrorClass<PluginsArg extends Plugins = []> = SpecificErrorClass<
  PluginsArg,
  ErrorProps,
  CustomClass
>
