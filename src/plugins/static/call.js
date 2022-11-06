import { getMethodOpts } from '../../options/method.js'
import { finalizePluginsOpts } from '../../options/plugins.js'
import { ERROR_CLASSES } from '../../subclass/map.js'
import { getPluginInfo } from '../info/main.js'

// Called on `ErrorClass[methodName](...args)`
export const callStaticMethod = function (
  { methodFunc, plugin, plugins, ErrorClass, errorData },
  ...args
) {
  const { classOpts } = ERROR_CLASSES.get(ErrorClass)
  const { args: argsA, methodOpts } = getMethodOpts(args, plugin)
  const options = finalizePluginsOpts({
    pluginsOpts: classOpts,
    methodOpts,
    plugins,
    plugin,
  })
  const info = getPluginInfo({
    options,
    errorData,
    ErrorClass,
    methodOpts,
    plugins,
    plugin,
  })
  return methodFunc(info, ...argsA)
}
