import { serialize } from 'error-serializer'
import { excludeKeys } from 'filter-obj'
import isPlainObj from 'is-plain-obj'
import safeJsonValue from 'safe-json-value'

import { isErrorInstance } from './check.js'

// The full format sets `level` and all error properties.
// It recurses on `errors` and additional properties.
// It is meant for transports which operates on objects like `http`.
export const toFullLogObject = function ({
  error,
  options: { level },
  AnyError,
}) {
  const object = serializeValue(error, AnyError, [])
  return { ...object, level }
}

const serializeValue = function (value, AnyError, parents) {
  const parentsA = [...parents, value]
  const valueA = serializeError(value, AnyError)
  const valueB = serializeRecurse(valueA, AnyError, parentsA)
  const valueC = safeJsonValue(valueB, { shallow: true }).value
  return valueC
}

const serializeError = function (value, AnyError) {
  if (!isErrorInstance(value)) {
    return value
  }

  const omittedProps = AnyError.normalize(value).getFullLogOmittedProps()
  const object = serialize(value, { shallow: true })
  return excludeKeys(object, omittedProps)
}

const serializeRecurse = function (value, AnyError, parents) {
  if (Array.isArray(value)) {
    return value
      .filter((child) => !parents.includes(child))
      .map((child) => serializeValue(child, AnyError, parents))
  }

  if (isPlainObj(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .filter((propName) => !parents.includes(value[propName]))
        .map((propName) => [
          propName,
          serializeValue(value[propName], AnyError, parents),
        ]),
    )
  }

  return value
}

// We use an instance method to get `unknownDeep` for nested errors
export const getFullLogOmittedProps = function ({
  unknownDeep,
  options: { stack = unknownDeep },
}) {
  return stack ? ['constructorArgs'] : ['constructorArgs', 'stack']
}
