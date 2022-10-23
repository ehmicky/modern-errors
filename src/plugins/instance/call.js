import { getMethodOpts } from '../../options/method.js'
import { getErrorPluginInfo } from '../info/main.js'

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
  const info = getErrorPluginInfo({
    error,
    errorData,
    AnyError,
    ErrorClasses,
    methodOpts,
    plugins,
    plugin,
  })
  return methodFunc(info, ...argsA)
}
