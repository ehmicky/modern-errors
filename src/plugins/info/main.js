import { getErrorInfo } from './error.js'

// Retrieve `info` passed to `plugin.properties|instanceMethods`, but not
// `staticMethods` since it does not have access to an error.
export const getErrorPluginInfo = function ({
  error,
  errorData,
  ErrorClasses,
  methodOpts,
  plugins,
  plugin,
}) {
  const { className, options } = getErrorInfo(
    { errorData, ErrorClasses, methodOpts, plugins, plugin },
    error,
  )
  const info = getPluginInfo({
    options,
    errorData,
    className,
    ErrorClasses,
    methodOpts,
    plugins,
    plugin,
  })
  return { ...info, error }
}

// Retrieve `info` passed to `plugin.properties|instanceMethods|staticMethods`
export const getPluginInfo = function ({
  options,
  errorData,
  className,
  ErrorClasses,
  methodOpts,
  plugins,
  plugin,
}) {
  const errorInfo = getErrorInfo.bind(undefined, {
    errorData,
    ErrorClasses,
    methodOpts,
    plugins,
    plugin,
  })
  const ErrorClassesA = getErrorClasses(ErrorClasses)
  return { options, className, ErrorClasses: ErrorClassesA, errorInfo }
}

// `ErrorClasses` are passed to all plugin methods.
// A shallow copy is done to prevent mutations.
const getErrorClasses = function (ErrorClasses) {
  return Object.fromEntries(Object.entries(ErrorClasses).map(getErrorClass))
}

const getErrorClass = function ([className, { ErrorClass }]) {
  return [className, ErrorClass]
}
