import { instancesData } from '../../subclass/map.js'

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
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(info, { error })
  return info
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
  const info = { options, ErrorClass, ErrorClasses, errorInfo }
  setInstancesData(info)
  return info
}

// `instancesData` is internal, undocumented and non-enumerable.
// It is only needed in very specific plugins like `modern-errors-serialize`
const setInstancesData = function (info) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(info, 'instancesData', {
    value: instancesData,
    enumerable: false,
    writable: true,
    configurable: true,
  })
}
