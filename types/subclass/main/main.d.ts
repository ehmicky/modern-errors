import type { ErrorName } from 'error-custom-class'

import type { PluginsStaticMethods } from '../../plugins/static.js'
import type { Plugins } from '../../plugins/shape.js'
import type {
  GetAggregateErrors,
  AggregateErrors,
} from '../../base/aggregate.js'
import type { SpecificErrorInstance } from '../../base/modify/main.js'
import type {
  BaseErrorInstance,
  NormalizeError,
} from '../../base/normalize/main.js'
import type {
  ErrorProps,
  MergeErrorProps,
} from '../../core_plugins/props/main.js'
import type {
  CustomAttributes,
  CustomInstanceAttributes,
} from '../custom/main.js'
import type { CustomStaticAttributes } from '../inherited.js'
import type { SpecificClassOptions } from '../../options/class.js'
import type { MainInstanceOptions } from '../../options/instance.js'
import type { NoAdditionalProps } from '../../utils.js'
import type {
  ErrorConstructor,
  ParentInstanceOptions,
  ParentExtra,
} from '../parent/main.js'

interface ErrorSubclassCore<
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
    SpecificErrorClass<
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
export type SpecificErrorClass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  CustomAttributesArg extends CustomAttributes,
> = ErrorSubclassCore<
  PluginsArg,
  ErrorPropsArg,
  ParentErrorClass,
  CustomAttributesArg
> &
  CustomStaticAttributes<
    PluginsArg,
    ParentErrorClass,
    keyof ErrorSubclassCore<
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
export type ErrorClass<PluginsArg extends Plugins = []> = SpecificErrorClass<
  PluginsArg,
  ErrorProps,
  ErrorConstructor<PluginsArg>,
  CustomAttributes
>

/**
 * `BaseError.subclass()` or `ErrorClass.subclass()`
 */
export type CreateSubclass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  CustomAttributesArg extends CustomAttributes,
> = <
  ErrorNameArg extends ErrorName,
  ClassOptionsArg extends SpecificClassOptions<
    PluginsArg,
    ErrorPropsArg,
    ParentErrorClass,
    CustomAttributesArg
  >,
>(
  errorName: ErrorNameArg,
  options?: ClassOptionsArg,
) => ClassOptionsArg extends { custom: ErrorConstructor<PluginsArg> }
  ? SpecificErrorClass<
      PluginsArg,
      MergeErrorProps<ErrorPropsArg, ClassOptionsArg>,
      ClassOptionsArg['custom'],
      CustomInstanceAttributes<
        SpecificErrorInstance<
          PluginsArg,
          ErrorPropsArg,
          CustomAttributes,
          AggregateErrors
        >,
        InstanceType<ClassOptionsArg['custom']>
      >
    >
  : SpecificErrorClass<
      PluginsArg,
      MergeErrorProps<ErrorPropsArg, ClassOptionsArg>,
      ParentErrorClass,
      CustomAttributesArg
    >
