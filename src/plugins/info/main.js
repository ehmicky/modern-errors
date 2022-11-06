import { isSubclass } from '../../utils/subclass.js'

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
  const { ErrorClass, options } = getErrorInfo(
    { errorData, ErrorClasses, methodOpts, plugins, plugin },
    error,
  )
  const info = getPluginInfo({
    options,
    errorData,
    ErrorClass,
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
  ErrorClass,
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
  const ErrorClassesA = getErrorClasses(ErrorClasses, ErrorClass)
  return { options, ErrorClass, ErrorClasses: ErrorClassesA, errorInfo }
}

// `ErrorClasses` are passed to all plugin methods.
// It excludes parent classes.
// A shallow copy is done to prevent mutations.
const getErrorClasses = function (ErrorClasses, ParentClass) {
  return Object.fromEntries(
    Object.entries(ErrorClasses)
      .filter(([, { ErrorClass }]) => isSubclass(ErrorClass, ParentClass))
      .map(getErrorClass),
  )
}

const getErrorClass = function ([className, { ErrorClass }]) {
  return [className, ErrorClass]
}
