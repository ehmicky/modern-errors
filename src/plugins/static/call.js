import { validateNonEmpty } from '../../any/subclass.js'
import { getPluginInfo } from '../info.js'
import { mergeMethodOpts } from '../method_opts.js'

// Called on `AnyError.{methodName}(...args)`
export const callStaticMethod = function (
  { methodFunc, plugin, plugins, globalOpts, ErrorClasses, AnyError },
  ...args
) {
  validateNonEmpty(ErrorClasses)
  const { args: argsA, pluginsOpts } = mergeMethodOpts({
    args,
    pluginsOpts: globalOpts,
    plugin,
    plugins,
  })
  const info = getPluginInfo({ pluginsOpts, plugin, AnyError, ErrorClasses })
  return methodFunc(info, ...argsA)
}
