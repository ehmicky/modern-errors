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
  errorInfo,
}) {
  const object = serializeValue({
    value: error,
    AnyError,
    parents: [],
    errorInfo,
  })
  return { ...object, level }
}

const serializeValue = function ({ value, AnyError, parents, errorInfo }) {
  const parentsA = [...parents, value]
  const valueA = serializeError(value, AnyError, errorInfo)
  const valueB = serializeRecurse({
    value: valueA,
    AnyError,
    parents: parentsA,
    errorInfo,
  })
  const valueC = safeJsonValue(valueB, { shallow: true }).value
  return valueC
}

const serializeError = function (value, AnyError, errorInfo) {
  if (!isErrorInstance(value)) {
    return value
  }

  const omittedProps = getOmittedProps(value, errorInfo)
  const object = serialize(value, { shallow: true })
  return excludeKeys(object, omittedProps)
}

const getOmittedProps = function (value, errorInfo) {
  const {
    unknownDeep,
    options: { stack = unknownDeep },
  } = errorInfo(value)
  return stack ? ['constructorArgs'] : ['constructorArgs', 'stack']
}

const serializeRecurse = function ({ value, AnyError, parents, errorInfo }) {
  if (Array.isArray(value)) {
    return value
      .filter((child) => !parents.includes(child))
      .map((child) =>
        serializeValue({ value: child, AnyError, parents, errorInfo }),
      )
  }

  if (isPlainObj(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .filter((propName) => !parents.includes(value[propName]))
        .map((propName) => [
          propName,
          serializeValue({
            value: value[propName],
            AnyError,
            parents,
            errorInfo,
          }),
        ]),
    )
  }

  return value
}
