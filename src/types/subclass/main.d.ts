import type { ErrorName } from 'error-custom-class'

import type { Plugins } from '../plugins/main.js'
import type { GetAggregateErrorsOption } from '../any/aggregate.js'
import type { ErrorProps, MergeErrorProps } from '../core_plugins/props.js'
import type { CustomAttributes, AddCustomAttributes } from './custom.js'
import type { CustomStaticAttributes } from './inherited.js'
import type { SpecificClassOptions } from '../options/class.js'
import type { BaseError } from '../any/modify.js'
import type { NoAdditionalProps } from '../utils.js'
import type { SpecificAnyErrorClass } from '../any/main.js'

import type { IsForbiddenClassName } from './name.js'
import type {
  ErrorConstructor,
  ParentInstanceOptions,
  ParentExtra,
} from './parent.js'

export type ErrorSubclass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  CustomAttributesArg extends CustomAttributes,
  ErrorNameArg extends ErrorName,
> = {
  /**
   *
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
    ErrorNameArg,
    GetAggregateErrorsOption<PluginsArg, ErrorPropsArg, InstanceOptionsArg>
  >
  readonly prototype: InstanceType<
    ErrorSubclass<
      PluginsArg,
      ErrorPropsArg,
      ParentErrorClass,
      CustomAttributesArg,
      ErrorNameArg
    >
  >

  /**
   *
   */
  readonly subclass: CreateSubclass<
    PluginsArg,
    ErrorPropsArg,
    ParentErrorClass,
    CustomAttributesArg
  >
} & CustomStaticAttributes<
  PluginsArg,
  SpecificAnyErrorClass<PluginsArg, ErrorPropsArg>,
  ParentErrorClass
>

/**
 *
 */
export type ErrorClass<PluginsArg extends Plugins = []> = ErrorSubclass<
  PluginsArg,
  ErrorProps,
  ErrorConstructor<PluginsArg>,
  CustomAttributes,
  ErrorName
>

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
) => IsForbiddenClassName<ErrorNameArg> extends true
  ? never
  : ClassOptionsArg['custom'] extends ErrorConstructor<PluginsArg>
  ? ErrorSubclass<
      PluginsArg,
      MergeErrorProps<ErrorPropsArg, ClassOptionsArg>,
      ClassOptionsArg['custom'],
      AddCustomAttributes<
        PluginsArg,
        SpecificAnyErrorClass<PluginsArg, ErrorPropsArg>,
        ClassOptionsArg['custom']
      >,
      ErrorNameArg
    >
  : ErrorSubclass<
      PluginsArg,
      MergeErrorProps<ErrorPropsArg, ClassOptionsArg>,
      ParentErrorClass,
      CustomAttributesArg,
      ErrorNameArg
    >
