import { getErrorOpts } from '../plugins/normalize.js'

// Plugins can define an `instanceMethods` object, which is merged to
// `AnyError.prototype.*`.
export const addAllInstanceMethods = function ({
  plugins,
  errorData,
  AnyError,
  state,
}) {
  plugins.forEach((plugin) => {
    addInstanceMethods({ plugin, errorData, AnyError, state })
  })
}

const addInstanceMethods = function ({
  plugin,
  plugin: { instanceMethods },
  errorData,
  AnyError,
  state,
}) {
  if (instanceMethods === undefined) {
    return
  }

  Object.entries(instanceMethods).forEach(([methodName, methodFunc]) => {
    addInstanceMethod({
      methodName,
      methodFunc,
      plugin,
      errorData,
      AnyError,
      state,
    })
  })
}

const addInstanceMethod = function ({
  methodName,
  methodFunc,
  plugin,
  errorData,
  AnyError,
  state,
}) {
  const value = function (...args) {
    // eslint-disable-next-line fp/no-this, no-invalid-this, consistent-this, unicorn/no-this-assignment
    const error = this
    const options = getErrorOpts(error, errorData, plugin)
    return methodFunc(
      { error, options, AnyError, KnownClasses: { ...state.KnownClasses } },
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
