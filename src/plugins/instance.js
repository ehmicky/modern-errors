import { getErrorOpts } from './normalize.js'

// Plugins can define an `instanceMethods` object, which is merged to
// `AnyError.prototype.*`.
export const addAllInstanceMethods = function ({
  plugins,
  ErrorClasses,
  errorData,
  AnyError,
}) {
  plugins.forEach((plugin) => {
    addInstanceMethods({ plugin, ErrorClasses, errorData, AnyError })
  })
}

const addInstanceMethods = function ({
  plugin,
  plugin: { instanceMethods },
  ErrorClasses,
  errorData,
  AnyError,
}) {
  if (instanceMethods === undefined) {
    return
  }

  Object.entries(instanceMethods).forEach(([methodName, methodFunc]) => {
    addInstanceMethod({
      methodName,
      methodFunc,
      plugin,
      ErrorClasses,
      errorData,
      AnyError,
    })
  })
}

const addInstanceMethod = function ({
  methodName,
  methodFunc,
  plugin,
  ErrorClasses,
  errorData,
  AnyError,
}) {
  const value = function (...args) {
    // eslint-disable-next-line fp/no-this, no-invalid-this, consistent-this, unicorn/no-this-assignment
    const error = this
    const options = getErrorOpts(error, errorData, plugin)
    return methodFunc(
      { error, options, AnyError, ErrorClasses: { ...ErrorClasses } },
      ...args,
    )
  }

  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(AnyError.prototype, methodName, {
    value,
    enumerable: false,
    writable: true,
    configurable: true,
  })
}
