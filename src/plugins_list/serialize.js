// eslint-disable-next-line filenames/match-exported
import { serialize, parse } from 'error-serializer'

const toJSON = function ({ error }) {
  return serialize(error)
}

const parseError = function ({ ErrorClasses, AnyError }, errorObject) {
  const value = parse(errorObject, { classes: ErrorClasses })
  return isErrorInstance(value) ? AnyError.normalize(value) : value
}

const isErrorInstance = function (value) {
  return Object.prototype.toString.call(value) === '[object Error]'
}

const SERIALIZE_PLUGIN = {
  name: 'serialize',
  instanceMethods: { toJSON },
  staticMethods: { parse: parseError },
}

// eslint-disable-next-line import/no-default-export
export default SERIALIZE_PLUGIN
