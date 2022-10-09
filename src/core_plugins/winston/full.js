import { serialize } from 'error-serializer'
import { excludeKeys } from 'filter-obj'
import isErrorInstance from 'is-error-instance'
import isPlainObj from 'is-plain-obj'
import safeJsonValue from 'safe-json-value'

// The full format sets `level` and all error properties.
// It recurses on `errors` and additional properties.
// It is meant for transports which operates on objects like `http`.
export const toFullLogObject = function ({ error, level, errorInfo }) {
  const object = serializeValue(error, [], errorInfo)
  return { ...object, level }
}

const serializeValue = function (value, parents, errorInfo) {
  const parentsA = [...parents, value]
  const valueA = serializeError(value, errorInfo)
  const valueB = serializeRecurse(valueA, parentsA, errorInfo)
  const valueC = safeJsonValue(valueB, { shallow: true }).value
  return valueC
}

const serializeError = function (value, errorInfo) {
  if (!isErrorInstance(value)) {
    return value
  }

  const omittedProps = getOmittedProps(value, errorInfo)
  const object = serialize(value, { shallow: true })
  return excludeKeys(object, omittedProps)
}

const getOmittedProps = function (value, errorInfo) {
  const {
    showStack,
    options: { stack = showStack },
  } = errorInfo(value)
  return stack ? ['constructorArgs'] : ['constructorArgs', 'stack']
}

const serializeRecurse = function (value, parents, errorInfo) {
  if (Array.isArray(value)) {
    return value
      .filter((child) => !parents.includes(child))
      .map((child) => serializeValue(child, parents, errorInfo))
  }

  if (isPlainObj(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .filter((propName) => !parents.includes(value[propName]))
        .map((propName) => [
          propName,
          serializeValue(value[propName], parents, errorInfo),
        ]),
    )
  }

  return value
}
