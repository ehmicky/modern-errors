import type { CorePluginsOptions } from '../../options/plugins.js'

/**
 * Error properties
 */
export type ErrorProps = object

/**
 * Merge error `props` together
 */
type MergeProps<
  PropsOne extends ErrorProps,
  PropsTwo extends ErrorProps,
> = keyof PropsTwo extends never
  ? PropsOne
  : Omit<PropsOne, keyof PropsTwo> & PropsTwo

/**
 * Retrieve the `props` option, if defined
 */
export type GetPropsOption<CorePluginsOptionsArg extends CorePluginsOptions> =
  CorePluginsOptionsArg['props'] extends ErrorProps
    ? CorePluginsOptionsArg['props']
    : {}

/**
 * Merge new error `props`, if defined as option
 */
export type MergeErrorProps<
  Props extends ErrorProps,
  CorePluginsOptionsArg extends CorePluginsOptions,
> = MergeProps<Props, GetPropsOption<CorePluginsOptionsArg>>
