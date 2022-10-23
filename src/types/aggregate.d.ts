import type { Plugins } from './plugin.js'
import type { NormalizeError } from './to_sort.js'
import type { SpecificInstanceOptions } from './options.js'
import type { ErrorProps } from './props.js'

type DefinedAggregateErrorsOption = unknown[]
export type AggregateErrorsOption = DefinedAggregateErrorsOption | undefined

type NormalizeAggregateErrors<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  AggregateErrorsArg extends AggregateErrorsOption,
> = AggregateErrorsArg extends [infer AggregateErrorArg, ...infer Rest]
  ? [
      NormalizeError<PluginsArg, ErrorPropsArg, AggregateErrorArg>,
      ...NormalizeAggregateErrors<PluginsArg, ErrorPropsArg, Rest>,
    ]
  : AggregateErrorsArg

type ConcatAggregateErrors<
  PluginsArg extends Plugins,
  InstanceOptionsArg extends SpecificInstanceOptions<PluginsArg>,
> = InstanceOptionsArg['errors'] extends DefinedAggregateErrorsOption
  ? 'errors' extends keyof InstanceOptionsArg['cause']
    ? InstanceOptionsArg['cause']['errors'] extends DefinedAggregateErrorsOption
      ? [
          ...InstanceOptionsArg['cause']['errors'],
          ...InstanceOptionsArg['errors'],
        ]
      : InstanceOptionsArg['errors']
    : InstanceOptionsArg['errors']
  : 'errors' extends keyof InstanceOptionsArg['cause']
  ? InstanceOptionsArg['cause']['errors'] extends DefinedAggregateErrorsOption
    ? InstanceOptionsArg['cause']['errors']
    : AggregateErrorsOption
  : AggregateErrorsOption

export type GetAggregateErrorsOption<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  InstanceOptionsArg extends SpecificInstanceOptions<PluginsArg>,
> = NormalizeAggregateErrors<
  PluginsArg,
  ErrorPropsArg,
  ConcatAggregateErrors<PluginsArg, InstanceOptionsArg>
>

export type AggregateErrorsProp<
  AggregateErrorsArg extends AggregateErrorsOption,
> = AggregateErrorsArg extends DefinedAggregateErrorsOption
  ? { errors: AggregateErrorsArg }
  : {}
