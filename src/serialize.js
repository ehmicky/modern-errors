import { serialize, parse as parseLib } from 'error-serializer'

// Set `error.toJSON()` so errors are automatically, deeply serializable
export const setErrorTypesToJSON = function (CustomErrorTypes) {
  Object.values(CustomErrorTypes).forEach(setErrorTypeToJSON)
}

const setErrorTypeToJSON = function (CustomErrorType) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(CustomErrorType.prototype, 'toJSON', {
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
export const parseValue = function (CustomErrorTypes, value) {
  return parseLib(value, { types: CustomErrorTypes, loose: true })
}
