import { validateNonEmpty } from '../../any/subclass.js'
import { getMethodOpts } from '../../options/method.js'
import { finalizePluginsOpts } from '../../options/plugins.js'
import { getPluginInfo } from '../info/main.js'

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
