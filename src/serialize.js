import { serialize, parse as parseLib } from 'error-serializer'
import { excludeKeys } from 'filter-obj'

// Set `error.toJSON()` so errors are automatically, deeply serializable
export const setErrorTypeToJSON = function (ErrorType) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(ErrorType.prototype, 'toJSON', {
    value: toJSON,
    enumerable: false,
    writable: true,
    configurable: true,
  })
}

const toJSON = function () {
  // eslint-disable-next-line fp/no-this, no-invalid-this
  return serialize(this)
}

// Parse serialized error deeply
export const parse = function (proxy, value) {
  const types = excludeKeys(proxy, NON_ERROR_TYPES)
  return parseLib(value, { types, loose: true })
}

// Returned properties that are not error types
const NON_ERROR_TYPES = ['errorHandler', 'parse']
