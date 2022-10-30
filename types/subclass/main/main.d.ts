import type { ErrorName } from 'error-custom-class'

import type { Plugins } from '../../plugins/shape.js'
import type { GetAggregateErrorsOption } from '../../any/aggregate.js'
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
import type { BaseError } from '../../any/modify/main.js'
import type { NoAdditionalProps } from '../../utils.js'
import type { SpecificAnyErrorClass } from '../../any/main.js'
import type { IsForbiddenClassName } from '../name.js'
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
    GetAggregateErrorsOption<PluginsArg, ErrorPropsArg, InstanceOptionsArg>
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
   * const SharedError = AnyError.subclass('SharedError', {
   *   custom: class extends AnyError {
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
 * Error class, including `AnyError`, with specific `props`, `custom`, etc.
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
    SpecificAnyErrorClass<PluginsArg, ErrorPropsArg>,
    ParentErrorClass
  >

/**
 * Error class, including `AnyError`
 */
export type ErrorClass<PluginsArg extends Plugins = []> = ErrorSubclass<
  PluginsArg,
  ErrorProps,
  ErrorConstructor<PluginsArg>,
  CustomAttributes
>

/**
 * `AnyError.subclass()` or `ErrorClass.subclass()`
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
    CustomAttributesArg,
    ErrorNameArg
  >,
>(
  errorName: ErrorNameArg,
  options?: ClassOptionsArg,
) => IsForbiddenClassName<ErrorNameArg> extends true
  ? never
  : ClassOptionsArg extends { custom: ErrorConstructor<PluginsArg> }
  ? ErrorSubclass<
      PluginsArg,
      MergeErrorProps<ErrorPropsArg, ClassOptionsArg>,
      ClassOptionsArg['custom'],
      CustomInstanceAttributes<
        InstanceType<SpecificAnyErrorClass<PluginsArg, ErrorPropsArg>>,
        InstanceType<ClassOptionsArg['custom']>
      >
    >
  : ErrorSubclass<
      PluginsArg,
      MergeErrorProps<ErrorPropsArg, ClassOptionsArg>,
      ParentErrorClass,
      CustomAttributesArg
    >
