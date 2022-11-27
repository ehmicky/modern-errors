import type { ErrorName } from 'error-custom-class'

import type { AggregateErrors } from '../merge/aggregate.js'
import type { SpecificErrorInstance } from '../merge/cause.js'
import type { SpecificClassOptions } from '../options/class.js'
import type { Cause } from '../options/instance.js'
import type { ErrorProps, MergeErrorProps } from '../plugins/core/props/main.js'
import type { PluginsMixedMethods } from '../plugins/instance/mixed.js'
import type { Plugins } from '../plugins/shape/main.js'
import type { PluginsStaticMethods } from '../plugins/static/main.js'
import type { OmitKeys } from '../utils/omit.js'
import type {
  CustomClass,
  ParentExtra,
  ParentInstanceOptions,
} from './custom/main.js'
import type { NormalizeError } from './normalize/main.js'

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

/**
 * Non-dynamic members of error classes
 */
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
   * Creates and returns a child `ErrorClass`.
   *
   * @example
   * ```js
   * export const InputError = ErrorClass.subclass('InputError', options)
   * ```
   */
  subclass: CreateSubclass<PluginsArg, ErrorPropsArg, CustomClassArg>

  /**
   * Normalizes invalid errors.
   *
   * If the `error`'s class is a subclass of `ErrorClass`, it is left as is.
   * Otherwise, it is converted to `NewErrorClass`, which defaults to
   * `ErrorClass` itself.
   *
   * @example
   * ```js
   * try {
   *   throw 'Missing file path.'
   * } catch (invalidError) {
   *   const normalizedError = BaseError.normalize(invalidError)
   *   // This works: 'Missing file path.'
   *   // `normalizedError` is a `BaseError` instance.
   *   console.log(normalizedError.message.trim())
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
  PluginsStaticMethods<PluginsArg> &
  PluginsMixedMethods<PluginsArg>

/**
 * Error class
 */
export type ErrorClass<PluginsArg extends Plugins = Plugins> =
  SpecificErrorClass<PluginsArg, ErrorProps, CustomClass>
