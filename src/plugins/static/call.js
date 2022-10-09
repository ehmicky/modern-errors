import { validateNonEmpty } from '../../any/subclass.js'
import { createErrorInfo } from '../error_info.js'
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
  const errorInfo = createErrorInfo({
    errorData,
    ErrorClasses,
    plugins,
    plugin,
    methodOpts,
  })
  const options = finalizePluginsOpts({
    pluginsOpts: globalOpts,
    methodOpts,
    plugins,
    plugin,
  })
  const info = getPluginInfo({ options, AnyError, ErrorClasses, errorInfo })
  return methodFunc(info, ...argsA)
}
