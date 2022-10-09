import { validateNonEmpty } from '../../any/subclass.js'
import { finalizePluginsOpts } from '../get.js'
import { getMethodOpts } from '../method_opts.js'
import { getPluginInfo } from '../plugin_info.js'

// Called on `AnyError.{methodName}(...args)`
export const callStaticMethod = function (
  {
    methodFunc,
    plugin,
    plugins,
    globalOpts,
    ErrorClasses,
    errorData,
    AnyError,
  },
  ...args
) {
  validateNonEmpty(ErrorClasses)
  const { args: argsA, methodOpts } = getMethodOpts(args, plugin)
  const options = finalizePluginsOpts({
    pluginsOpts: globalOpts,
    methodOpts,
    plugins,
    plugin,
  })
  const info = getPluginInfo({
    options,
    errorData,
    AnyError,
    ErrorClasses,
    methodOpts,
    plugins,
    plugin,
  })
  return methodFunc(info, ...argsA)
}
