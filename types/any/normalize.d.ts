import type { ErrorName } from 'error-custom-class'
import type { Plugins } from '../plugins/shape.js'
import type { GetAggregateErrorsOption } from './aggregate.js'
import type { ErrorProps } from '../core_plugins/props.js'
import type { CustomInstanceAttributes } from '../subclass/custom.js'
import type { SpecificInstanceOptions } from '../options/instance.js'
import type { ErrorInstance, BaseError } from './modify.js'

type NormalizedErrorName<ErrorArg extends unknown> = unknown extends ErrorArg
  ? ErrorName
  : ErrorArg extends ErrorInstance
  ? ErrorArg['name']
  : 'UnknownError'

export type AnyErrorInstance<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
  SpecificInstanceOptionsArg extends SpecificInstanceOptions<PluginsArg>,
> = BaseError<
  PluginsArg,
  ErrorPropsArg,
  CustomInstanceAttributes<Error, ErrorArg>,
  NormalizedErrorName<ErrorArg>,
  GetAggregateErrorsOption<
    PluginsArg,
    ErrorPropsArg,
    SpecificInstanceOptionsArg
  >
>

export type NormalizeError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
> = ErrorArg extends ErrorInstance
  ? ErrorArg
  : AnyErrorInstance<
      PluginsArg,
      ErrorPropsArg,
      ErrorArg,
      SpecificInstanceOptions<PluginsArg>
    >