import { setNonEnumProp } from '../../utils/descriptors.js'

import { callInstanceMethod } from './call.js'
import { callMixedMethod } from './mixed.js'

// Plugins can define an `instanceMethods` object, which is merged to
// `ErrorClass.prototype.*`.
export const addAllInstanceMethods = (plugins, ErrorClass) => {
  plugins.forEach((plugin) => {
    addInstanceMethods(plugin, plugins, ErrorClass)
  })
}

const addInstanceMethods = (plugin, plugins, ErrorClass) => {
  Object.entries(plugin.instanceMethods).forEach(
    addInstanceMethod.bind(undefined, { plugin, plugins, ErrorClass }),
  )
}

const addInstanceMethod = (
  { plugin, plugins, ErrorClass },
  [methodName, methodFunc],
) => {
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
        args,
      })
    },
  )
  setNonEnumProp(
    ErrorClass,
    methodName,
    callMixedMethod.bind(undefined, {
      methodFunc,
      plugin,
      plugins,
      ErrorClass,
    }),
  )
}

// Retrieve the name of all instance methods
export const getPluginsMethodNames = (plugins) =>
  plugins.flatMap(getPluginMethodNames)

const getPluginMethodNames = ({ instanceMethods }) =>
  Object.keys(instanceMethods)
