import { getMethodOpts } from '../../options/method.js'
import { finalizePluginsOpts } from '../../options/plugins.js'
import { getPluginInfo } from '../info/main.js'

// Called on `AnyError.{methodName}(...args)`
export const callStaticMethod = function ({
  methodFunc,
  methodName,
  plugin,
  plugins,
  ErrorClass,
  ErrorClasses,
  errorData,
  AnyError,
  args,
}) {
  if (!Object.prototype.isPrototypeOf.call(AnyError, ErrorClass)) {
    throw new TypeError(
      `Missing "this" context: "${methodName}()" must be called using "ErrorClass.${methodName}()"`,
    )
  }

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
    AnyError,
    ErrorClasses,
    methodOpts,
    plugins,
    plugin,
  })
  return methodFunc(info, ...argsA)
}
