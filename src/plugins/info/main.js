import { ERROR_CLASSES } from '../../subclass/map.js'
import { isSubclass } from '../../utils/subclass.js'

import { getErrorInfo } from './error.js'

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
  const ErrorClasses = [] // getErrorClasses(ErrorClass)
  return { options, ErrorClass, ErrorClasses, errorInfo }
}

// `ErrorClasses` are passed to all plugin methods.
// It excludes parent classes.
// A shallow copy is done to prevent mutations.
// This is an array, not an object, since some error classes might have
// duplicate names.
const getErrorClasses = function (ParentClass) {
  return Object.values(ErrorClasses)
    .map(getErrorClass)
    .filter((ErrorClass) => isSubclass(ErrorClass, ParentClass))
}

const getErrorClass = function ({ ErrorClass }) {
  return ErrorClass
}
