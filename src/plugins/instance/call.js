import { getPluginInfo } from '../info.js'
import { mergeClassOpts } from '../merge.js'
import { getMethodOpts, mergeMethodOpts } from '../method_opts.js'

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

  const { args: argsA, methodOpts } = getMethodOpts(args, plugin)

  const { pluginsOpts, unknownDeep } = errorData.get(error)
  const pluginsOptsA = mergeClassOpts({
    error,
    ErrorClasses,
    plugins,
    pluginsOpts,
  })
  const pluginsOptsB = mergeMethodOpts(pluginsOptsA, methodOpts, plugins)

  const info = getPluginInfo({
    pluginsOpts: pluginsOptsB,
    plugin,
    AnyError,
    ErrorClasses,
  })
  return methodFunc({ ...info, error, unknownDeep }, ...argsA)
}
