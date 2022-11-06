import type { ErrorName } from 'error-custom-class'

import type { Plugins } from '../../plugins/shape.js'
import type { GetAggregateErrors } from '../../base/aggregate.js'
import type { BaseError } from '../../base/modify/main.js'
import type { SpecificBaseErrorClass } from '../../base/main.js'
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
  ): BaseError<
    PluginsArg,
    MergeErrorProps<ErrorPropsArg, InstanceOptionsArg>,
    CustomAttributesArg,
    GetAggregateErrors<InstanceOptionsArg>
  >

  readonly prototype: InstanceType<
    ErrorSubclass<
      PluginsArg,
      ErrorPropsArg,
      ParentErrorClass,
      CustomAttributesArg
    >
  >

  /**
   * Creates and returns an error subclass, to share logic between error
   * classes.
   *
   * @example
   * ```js
   * const SharedError = BaseError.subclass('SharedError', {
   *   custom: class extends BaseError {
   *     // ...
   *   },
   * })
   *
   * export const InputError = SharedError.subclass('InputError')
   * export const AuthError = SharedError.subclass('AuthError')
   * ```
   */
  readonly subclass: CreateSubclass<
    PluginsArg,
    ErrorPropsArg,
    ParentErrorClass,
    CustomAttributesArg
  >
}

/**
 * Error class, including `BaseError`, with specific `props`, `custom`, etc.
 */
export type ErrorSubclass<
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
    SpecificBaseErrorClass<PluginsArg, ErrorPropsArg>,
    ParentErrorClass
  >

/**
 * Error class, including `BaseError`
 */
export type ErrorClass<PluginsArg extends Plugins = []> = ErrorSubclass<
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
  ? ErrorSubclass<
      PluginsArg,
      MergeErrorProps<ErrorPropsArg, ClassOptionsArg>,
      ClassOptionsArg['custom'],
      CustomInstanceAttributes<
        InstanceType<SpecificBaseErrorClass<PluginsArg, ErrorPropsArg>>,
        InstanceType<ClassOptionsArg['custom']>
      >
    >
  : ErrorSubclass<
      PluginsArg,
      MergeErrorProps<ErrorPropsArg, ClassOptionsArg>,
      ParentErrorClass,
      CustomAttributesArg
    >
