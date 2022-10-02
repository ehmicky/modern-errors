import { serialize, parse as parseLib } from 'error-serializer'

const toJSON = function ({ error }) {
  return serialize(error)
}

const parse = function ({ ErrorClasses, AnyError }, errorObject) {
  const value = parseLib(errorObject, { classes: ErrorClasses })
  return isErrorInstance(value) ? AnyError.normalize(value) : value
}

const isErrorInstance = function (value) {
  return Object.prototype.toString.call(value) === '[object Error]'
}

// eslint-disable-next-line import/no-default-export
export default {
  name: 'serialize',
  instanceMethods: { toJSON },
  staticMethods: { parse },
}
