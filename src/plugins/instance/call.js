import { createErrorInfo } from '../error_info.js'
import { getMethodOpts } from '../method_opts.js'
import { getErrorPluginInfo } from '../plugin_info.js'

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
  const errorInfo = createErrorInfo({
    errorData,
    ErrorClasses,
    plugins,
    plugin,
    methodOpts,
  })
  const info = getErrorPluginInfo({ error, AnyError, ErrorClasses, errorInfo })
  return methodFunc(info, ...argsA)
}
