/**
 * Error properties
 */
export type ErrorProps = object

/**
 * Merge error `props` from the class options and instance options
 */
export type MergeErrorProps<
  PropsOne extends ErrorProps,
  PropsTwo extends ErrorProps,
> = keyof PropsTwo extends keyof PropsOne
  ? PropsOne
  : keyof PropsOne extends keyof PropsTwo
  ? PropsTwo
  : keyof PropsOne & keyof PropsTwo extends never
  ? PropsOne & PropsTwo
  : Omit<PropsOne, keyof PropsTwo> & PropsTwo
