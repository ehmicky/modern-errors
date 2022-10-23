import type { CorePluginsOptions } from './to_sort.js'

export type ErrorProps = object

type MergeProps<
  PropsOne extends ErrorProps,
  PropsTwo extends ErrorProps,
> = keyof PropsTwo extends never
  ? PropsOne
  : Omit<PropsOne, keyof PropsTwo> & PropsTwo

export type GetPropsOption<CorePluginsOptionsArg extends CorePluginsOptions> =
  unknown extends CorePluginsOptionsArg
    ? {}
    : CorePluginsOptionsArg['props'] extends ErrorProps
    ? CorePluginsOptionsArg['props']
    : {}

export type MergeErrorProps<
  Props extends ErrorProps,
  CorePluginsOptionsArg extends CorePluginsOptions,
> = MergeProps<Props, GetPropsOption<CorePluginsOptionsArg>>
