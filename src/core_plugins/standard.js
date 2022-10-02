import isPlainObj from 'is-plain-obj'
import safeJsonValue from 'safe-json-value'
import statuses from 'statuses'

// Normalize and validate options
const getOptions = function (options = {}) {
  if (!isPlainObj(options)) {
    throw new TypeError(`It must be a plain object: ${options}`)
  }

  return Object.fromEntries(
    Object.entries(options).map(normalizeOption).filter(Boolean),
  )
}

const normalizeOption = function ([optName, optValue]) {
  const validator = VALIDATORS[optName]

  if (validator === undefined) {
    const availableOpts = Object.keys(VALIDATORS).join(', ')
    throw new TypeError(`Unknown option "${optName}".
Available options: ${availableOpts}`)
  }

  if (optValue === undefined) {
    return
  }

  validator(optValue, optName)
  return [optName, optValue]
}

const validateStatus = function (optValue, optName) {
  if (!Number.isInteger(optValue)) {
    throw new TypeError(`"${optName}" must be an integer: ${optValue}`)
  }

  if (!STATUSES.has(optValue)) {
    throw new TypeError(`"${optName}" must be an HTTP status code: ${optValue}`)
  }
}

const STATUSES = new Set(statuses.codes)

const validateURI = function (optValue, optName) {
  validateString(optValue, optName)

  try {
    // eslint-disable-next-line no-new
    new URL(optValue, EXAMPLE_ORIGIN)
  } catch (error) {
    throw new TypeError(
      `"${optName}" must not be "${optValue}" but a valid URL: ${error.message}`,
    )
  }
}

const EXAMPLE_ORIGIN = 'https://example.com'

const validateString = function (optValue, optName) {
  if (typeof optValue !== 'string') {
    throw new TypeError(`"${optName}" must be a string: ${optValue}`)
  }
}

const validateObject = function (optValue, optName) {
  if (!isPlainObj(optValue)) {
    throw new TypeError(`"${optName}" must be a plain object: ${optValue}`)
  }
}

const VALIDATORS = {
  type: validateURI,
  status: validateStatus,
  title: validateString,
  detail: validateString,
  instance: validateURI,
  stack: validateString,
  extra: validateObject,
}

// Turn `error` into a RFC 7807 problem details object.
// Object keys order is significant.
const toStandard = function ({
  // eslint-disable-next-line no-unused-vars
  error: { name, message, stack, cause, errors, ...errorProps },
  options,
}) {
  return safeJsonValue({
    ...getOptionalProp(options, 'type'),
    ...getOptionalProp(options, 'status'),
    ...getDefaultedProp(options, 'title', String(name)),
    ...getDefaultedProp(options, 'detail', String(message)),
    ...getOptionalProp(options, 'instance'),
    ...getDefaultedProp(options, 'stack', String(stack)),
    ...getExtra(options, errorProps),
  }).value
}

const getOptionalProp = function (options, optName) {
  return options[optName] === undefined ? {} : { [optName]: options[optName] }
}

const getDefaultedProp = function (options, optName, defaultValue) {
  return { [optName]: options[optName] ?? defaultValue }
}

const getExtra = function ({ extra }, errorProps) {
  if (extra !== undefined) {
    return { extra }
  }

  return Object.keys(errorProps).length === 0 ? {} : { extra: errorProps }
}

// eslint-disable-next-line import/no-default-export
export default {
  name: 'standard',
  getOptions,
  instanceMethods: { toStandard },
}
