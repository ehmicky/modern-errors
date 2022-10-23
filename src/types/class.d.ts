import type { ErrorName } from 'error-custom-class'
import type { Plugins } from './plugins/main.js'
import type { GetAggregateErrorsOption } from './aggregate.js'
import type { ErrorProps, MergeErrorProps } from './props.js'
import type {
  CustomAttributes,
  AddCustomAttributes,
  CustomStaticAttributes,
} from './attributes.js'
import type {
  SpecificClassOptions,
  SpecificInstanceOptions,
} from './options.js'
import type { ErrorInstance, BaseError } from './instance.js'
import type { NoAdditionalProps } from './utils.js'
import type { SpecificAnyErrorClass } from './any.js'

export type ErrorConstructor<PluginsArg extends Plugins> = new (
  message: string,
  options?: SpecificInstanceOptions<PluginsArg>,
  ...extra: any[]
) => ErrorInstance<PluginsArg>

type ParentInstanceOptions<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = ConstructorParameters<ParentErrorClass>[1] &
  SpecificInstanceOptions<PluginsArg>

type ParentExtra<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = ConstructorParameters<ParentErrorClass> extends [
  unknown,
  unknown?,
  ...infer Extra,
]
  ? Extra
  : never

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
) => ClassOptionsArg['custom'] extends ErrorConstructor<PluginsArg>
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
