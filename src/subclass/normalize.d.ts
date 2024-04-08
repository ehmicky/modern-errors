import type {
  AggregateErrorOption,
  DefinedAggregateErrors,
} from '../merge/aggregate.js'
import type { ErrorInstance } from '../merge/cause.js'
import type { ErrorProps } from '../plugins/core/props/main.js'
import type { Plugins } from '../plugins/shape/main.js'
import type { SetProps } from '../utils/omit.js'

import type { SpecificErrorClass } from './create.js'
import type { CustomClass } from './custom.js'

/**
 * `ErrorClass.normalize()`.
 *
 * @private This type is private and only exported as a temporary workaround
 * for an open issue with TypeScript. It will be removed in a future release.
 * See:
 *
 * - [modern-errors issue #18](https://github.com/ehmicky/modern-errors/issues/18)
 * - [TypeScript issue #47663](https://github.com/microsoft/TypeScript/issues/47663)
 */
export type NormalizeError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomClassArg extends CustomClass,
> = <
  ErrorArg,
  NewErrorClass extends SpecificErrorClass<
    PluginsArg,
    ErrorPropsArg,
    CustomClassArg
  > = SpecificErrorClass<PluginsArg, ErrorPropsArg, CustomClassArg>,
>(
  error: ErrorArg,
  NewErrorClass?: NewErrorClass,
) => NormalizeDeepError<
  ErrorArg,
  InstanceType<SpecificErrorClass<PluginsArg, ErrorPropsArg, CustomClassArg>> &
    ErrorInstance,
  InstanceType<NewErrorClass> & ErrorInstance
>

/**
 * Apply `ErrorClass.normalize()` on both `error` and `error.errors`
 */
type NormalizeDeepError<
  ErrorArg,
  ParentError extends ErrorInstance,
  NewError extends ErrorInstance,
> = ErrorArg extends {
  errors: infer AggregateErrorsArg extends DefinedAggregateErrors
}
  ? Omit<NormalizeOneError<ErrorArg, ParentError, NewError>, 'errors'> & {
      errors: NormalizeManyErrors<AggregateErrorsArg, ParentError, NewError>
    }
  : NormalizeOneError<ErrorArg, ParentError, NewError>

/**
 * Apply `ErrorClass.normalize()` on `error.errors`
 */
type NormalizeManyErrors<
  AggregateErrorsArg extends DefinedAggregateErrors,
  ParentError extends ErrorInstance,
  NewError extends ErrorInstance,
> = AggregateErrorsArg extends never[]
  ? []
  : AggregateErrorsArg extends readonly [
      infer AggregateErrorArg extends AggregateErrorOption,
      ...infer Rest extends DefinedAggregateErrors,
    ]
  ? [
      NormalizeDeepError<AggregateErrorArg, ParentError, NewError>,
      ...NormalizeManyErrors<Rest, ParentError, NewError>,
    ]
  : NormalizeDeepError<AggregateErrorsArg[number], ParentError, NewError>[]

/**
 * Apply `ErrorClass.normalize()` on `error`, but not `error.errors`
 */
type NormalizeOneError<
  ErrorArg,
  ParentError extends ErrorInstance,
  NewError extends ErrorInstance,
> = ErrorArg extends ParentError
  ? ErrorArg
  : ErrorArg extends Error
  ? SetProps<ErrorArg, NewError>
  : NewError
