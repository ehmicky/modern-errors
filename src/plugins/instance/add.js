import { setNonEnumProp } from '../../utils/descriptors.js'

import { callInstanceMethod } from './call.js'

// Plugins can define an `instanceMethods` object, which is merged to
// `AnyError.prototype.*`.
export const addAllInstanceMethods = function ({
  plugins,
  ErrorClasses,
  ErrorClass,
  errorData,
}) {
  plugins.forEach((plugin) => {
    addInstanceMethods({ plugin, plugins, ErrorClasses, ErrorClass, errorData })
  })
}

const addInstanceMethods = function ({
  plugin,
  plugin: { instanceMethods },
  plugins,
  ErrorClasses,
  ErrorClass,
  errorData,
}) {
  Object.entries(instanceMethods).forEach(
    addInstanceMethod.bind(undefined, {
      plugin,
      plugins,
      ErrorClasses,
      ErrorClass,
      errorData,
    }),
  )
}

const addInstanceMethod = function (
  { plugin, plugins, ErrorClasses, ErrorClass, errorData },
  [methodName, methodFunc],
) {
  setNonEnumProp(
    ErrorClass.prototype,
    methodName,
    function boundInstanceMethod(...args) {
      return callInstanceMethod({
        // eslint-disable-next-line fp/no-this, no-invalid-this
        error: this,
        methodFunc,
        methodName,
        plugin,
        plugins,
        ErrorClass,
        ErrorClasses,
        errorData,
        args,
      })
    },
  )
}

// Retrieve the name of all instance methods
export const getPluginsMethodNames = function (plugins) {
  return plugins.flatMap(getPluginMethodNames)
}

const getPluginMethodNames = function ({ instanceMethods }) {
  return Object.keys(instanceMethods)
}
