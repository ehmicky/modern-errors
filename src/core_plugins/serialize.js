import { serialize, parse as parseLib } from 'error-serializer'
import isErrorInstance from 'is-error-instance'

const toJSON = function ({ error }) {
  return serialize(error)
}

const parse = function ({ ErrorClasses, AnyError }, errorObject) {
  const value = parseLib(errorObject, { classes: ErrorClasses })
  return isErrorInstance(value) ? AnyError.normalize(value) : value
}

// eslint-disable-next-line import/no-default-export
export default {
  name: 'serialize',
  instanceMethods: { toJSON },
  staticMethods: { parse },
}
