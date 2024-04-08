import type { AggregateErrors } from '../merge/aggregate.js'
import type {
  Cause,
  InstanceOptions,
  SpecificInstanceOptions,
} from '../options/instance.js'
import type { ErrorProps } from '../plugins/core/props/main.js'
import type { Plugins } from '../plugins/shape/main.js'

/**
 * `custom` option
 *
 * @private This type is private and only exported as a temporary workaround
 * for an open issue with TypeScript. It will be removed in a future release.
 * See:
 *
 * - [modern-errors issue #18](https://github.com/ehmicky/modern-errors/issues/18)
 * - [TypeScript issue #47663](https://github.com/microsoft/TypeScript/issues/47663)
 */
export interface CustomClass {
  new (message: string, options?: InstanceOptions): Error
  subclass: unknown
}

/**
 * Second argument of the `constructor` of the parent error class
 */
export type ParentInstanceOptions<
  PluginsArg extends Plugins,
  ChildProps extends ErrorProps,
  CustomClassArg extends CustomClass,
  AggregateErrorsArg extends AggregateErrors,
  CauseArg extends Cause,
> = ConstructorParameters<CustomClassArg>[1] &
  SpecificInstanceOptions<PluginsArg, ChildProps, AggregateErrorsArg, CauseArg>

/**
 * Last variadic arguments of the `constructor` of the parent error class
 */
export type ParentExtra<CustomClassArg extends CustomClass> =
  ConstructorParameters<CustomClassArg> extends readonly [
    unknown,
    unknown?,
    ...infer Extra extends readonly unknown[],
  ]
    ? Extra
    : readonly never[]
