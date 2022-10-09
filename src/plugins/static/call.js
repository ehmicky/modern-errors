import { validateNonEmpty } from '../../any/subclass.js'
import { finalizePluginsOpts } from '../get.js'
import { getPluginInfo } from '../info.js'
import { getMethodOpts } from '../method_opts.js'

// Called on `AnyError.{methodName}(...args)`
export const callStaticMethod = function (
  { methodFunc, plugin, plugins, globalOpts, ErrorClasses, AnyError },
  ...args
) {
  validateNonEmpty(ErrorClasses)
  const { args: argsA, methodOpts } = getMethodOpts(args, plugin)
  const pluginsOpts = finalizePluginsOpts({
    pluginsOpts: globalOpts,
    methodOpts,
    plugins,
    plugin,
  })
  const info = getPluginInfo(pluginsOpts, AnyError, ErrorClasses)
  return methodFunc(info, ...argsA)
}
