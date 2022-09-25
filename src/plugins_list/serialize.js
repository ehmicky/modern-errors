// eslint-disable-next-line filenames/match-exported
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

const SERIALIZE_PLUGIN = {
  name: 'serialize',
  instanceMethods: { toJSON },
  staticMethods: { parse },
}

// eslint-disable-next-line import/no-default-export
export default SERIALIZE_PLUGIN
