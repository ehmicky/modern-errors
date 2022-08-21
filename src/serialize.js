import { serialize, parse as parseLib } from 'error-serializer'

// Set `error.toJSON()` so errors are automatically, deeply serializable
export const setErrorClassesToJSON = function (CustomErrorClasses) {
  Object.values(CustomErrorClasses).forEach(setErrorClassToJSON)
}

const setErrorClassToJSON = function (CustomErrorClass) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(CustomErrorClass.prototype, 'toJSON', {
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
export const parseValue = function (CustomErrorClasses, value) {
  return parseLib(value, { types: CustomErrorClasses, loose: true })
}
