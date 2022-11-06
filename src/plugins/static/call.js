import { getMethodOpts } from '../../options/method.js'
import { finalizePluginsOpts } from '../../options/plugins.js'
import { getPluginInfo } from '../info/main.js'

// Called on `ErrorClass[methodName](...args)`
export const callStaticMethod = function (
  { methodFunc, plugin, plugins, ErrorClass, ErrorClasses, errorData },
  ...args
) {
  const { classOpts } = ErrorClasses[ErrorClass.name]
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
    ErrorClasses,
    methodOpts,
    plugins,
    plugin,
  })
  return methodFunc(info, ...argsA)
}
