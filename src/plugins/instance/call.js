import { getPluginInfo } from '../info.js'
import { mergeClassOpts } from '../merge.js'
import { mergeMethodOpts } from '../method_opts.js'

// Called on `error.{methodName}(...args)`
export const callInstanceMethod = function ({
  error,
  methodFunc,
  methodName,
  plugin,
  plugins,
  ErrorClasses,
  errorData,
  AnyError,
  args,
}) {
  if (!(error instanceof AnyError)) {
    throw new TypeError(
      `Missing "this" context: "${methodName}()" must be called using "error.${methodName}()"`,
    )
  }

  const { pluginsOpts, unknownDeep } = errorData.get(error)
  const pluginsOptsA = mergeClassOpts({
    error,
    ErrorClasses,
    plugins,
    pluginsOpts,
  })
  const { args: argsA, pluginsOpts: pluginsOptsB } = mergeMethodOpts({
    args,
    pluginsOpts: pluginsOptsA,
    plugin,
    plugins,
  })
  const info = getPluginInfo({
    pluginsOpts: pluginsOptsB,
    plugin,
    AnyError,
    ErrorClasses,
  })
  return methodFunc({ ...info, error, unknownDeep }, ...argsA)
}
