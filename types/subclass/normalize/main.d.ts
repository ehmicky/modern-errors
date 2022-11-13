import type {
  AggregateErrorOption,
  DefinedAggregateErrors,
} from '../../merge/aggregate.js'
import type { ErrorInstance } from '../../merge/cause/main.js'
import type { ErrorProps } from '../../plugins/core/props/main.js'
import type { Plugins } from '../../plugins/shape.js'
import type { SetProps } from '../../utils.js'
import type { SpecificErrorClass } from '../create/main.js'
import type { CustomClass } from '../custom/main.js'

/**
 * `ErrorClass.normalize()`.
 */
export type NormalizeError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomClassArg extends CustomClass,
> = <
  ErrorArg extends unknown,
  UnknownErrorClass extends SpecificErrorClass<
    PluginsArg,
    ErrorPropsArg,
    CustomClassArg
  > = SpecificErrorClass<PluginsArg, ErrorPropsArg, CustomClassArg>,
>(
  error: ErrorArg,
  UnknownErrorClass?: UnknownErrorClass,
) => NormalizeDeepError<
  ErrorArg,
  InstanceType<SpecificErrorClass<PluginsArg, ErrorPropsArg, CustomClassArg>>,
  InstanceType<UnknownErrorClass>
>

/**
 * Apply `ErrorClass.normalize()` on both `error` and `error.errors`
 */
type NormalizeDeepError<
  ErrorArg extends unknown,
  ParentError extends ErrorInstance,
  UnknownError extends ErrorInstance,
> = ErrorArg extends {
  errors: infer AggregateErrorsArg extends DefinedAggregateErrors
}
  ? Omit<NormalizeOneError<ErrorArg, ParentError, UnknownError>, 'errors'> & {
      errors: NormalizeManyErrors<AggregateErrorsArg, ParentError, UnknownError>
    }
  : NormalizeOneError<ErrorArg, ParentError, UnknownError>

/**
 * Apply `ErrorClass.normalize()` on `error.errors`
 */
type NormalizeManyErrors<
  AggregateErrorsArg extends DefinedAggregateErrors,
  ParentError extends ErrorInstance,
  UnknownError extends ErrorInstance,
> = AggregateErrorsArg extends never[]
  ? []
  : AggregateErrorsArg extends readonly [
      infer AggregateErrorArg extends AggregateErrorOption,
      ...infer Rest extends DefinedAggregateErrors,
    ]
  ? [
      NormalizeDeepError<AggregateErrorArg, ParentError, UnknownError>,
      ...NormalizeManyErrors<Rest, ParentError, UnknownError>,
    ]
  : NormalizeDeepError<AggregateErrorsArg[number], ParentError, UnknownError>[]

/**
 * Apply `ErrorClass.normalize()` on `error`, but not `error.errors`
 */
type NormalizeOneError<
  ErrorArg extends unknown,
  ParentError extends ErrorInstance,
  UnknownError extends ErrorInstance,
> = ErrorArg extends ParentError
  ? ErrorArg
  : ErrorArg extends Error
  ? SetProps<ErrorArg, UnknownError>
  : UnknownError
