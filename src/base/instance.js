import { getErrorOpts } from '../plugins/normalize.js'

// Plugins can define an `instanceMethods` object, which is merged to
// `BaseError.prototype.*`.
export const addAllInstanceMethods = function ({
  plugins,
  errorData,
  BaseError,
  state,
}) {
  plugins.forEach((plugin) => {
    addInstanceMethods({ plugin, errorData, BaseError, state })
  })
}

const addInstanceMethods = function ({
  plugin,
  plugin: { instanceMethods },
  errorData,
  BaseError,
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
      BaseError,
      state,
    })
  })
}

const addInstanceMethod = function ({
  methodName,
  methodFunc,
  plugin,
  errorData,
  BaseError,
  state,
}) {
  const value = function (...args) {
    // eslint-disable-next-line fp/no-this, no-invalid-this, consistent-this, unicorn/no-this-assignment
    const error = this
    const options = getErrorOpts(error, errorData, plugin)
    const { AnyError, KnownClasses } = state
    return methodFunc(
      { error, options, AnyError, KnownClasses: { ...KnownClasses } },
      ...args,
    )
  }

  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(BaseError.prototype, methodName, {
    value,
    enumerable: false,
    writable: true,
    configurable: true,
  })
}
