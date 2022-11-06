import { getMethodOpts } from '../../options/method.js'
import { finalizePluginsOpts } from '../../options/plugins.js'
import { classesData } from '../../subclass/map.js'
import { getPluginInfo } from '../info/main.js'

// Called on `ErrorClass[methodName](...args)`
export const callStaticMethod = function (
  { methodFunc, plugin, plugins, ErrorClass },
  ...args
) {
  const { classOpts } = classesData.get(ErrorClass)
  const { args: argsA, methodOpts } = getMethodOpts(args, plugin)
  const options = finalizePluginsOpts({
    pluginsOpts: classOpts,
    methodOpts,
    plugins,
    plugin,
  })
  const info = getPluginInfo({
    options,
    ErrorClass,
    methodOpts,
    plugins,
    plugin,
  })
  return methodFunc(info, ...argsA)
}
