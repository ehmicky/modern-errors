import { getErrorInfo, getSubclasses } from './error.js'

// Retrieve `info` passed to `plugin.properties|instanceMethods`, but not
// `staticMethods` since it does not have access to an error.
export const getErrorPluginInfo = function ({
  error,
  methodOpts,
  plugins,
  plugin,
}) {
  const { ErrorClass, options } = getErrorInfo(
    { methodOpts, plugins, plugin },
    error,
  )
  const info = getPluginInfo({
    options,
    ErrorClass,
    methodOpts,
    plugins,
    plugin,
  })
  return { ...info, error }
}

// Retrieve `info` passed to `plugin.properties|instanceMethods|staticMethods`
export const getPluginInfo = function ({
  options,
  ErrorClass,
  methodOpts,
  plugins,
  plugin,
}) {
  const errorInfo = getErrorInfo.bind(undefined, {
    methodOpts,
    plugins,
    plugin,
  })
  const ErrorClasses = getSubclasses(ErrorClass)
  return { options, ErrorClass, ErrorClasses, errorInfo }
}
