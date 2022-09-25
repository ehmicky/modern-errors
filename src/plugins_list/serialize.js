// eslint-disable-next-line filenames/match-exported
import { serialize, parse } from 'error-serializer'

const isOptions = function () {
  return false
}

const toJSON = function ({ error }) {
  return serialize(error)
}

const parseError = function ({ ErrorClasses, AnyError }, errorObject) {
  const value = parse(errorObject, { classes: ErrorClasses })
  return AnyError.normalize(value)
}

const SERIALIZE_PLUGIN = {
  name: 'serialize',
  isOptions,
  instanceMethods: { toJSON },
  staticMethods: { parse: parseError },
}

// eslint-disable-next-line import/no-default-export
export default SERIALIZE_PLUGIN
