import isPlainObj from 'is-plain-obj'
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
  title: validateString,
  details: validateString,
  status: validateStatus,
  type: validateURI,
  instance: validateURI,
  stack: validateString,
  extra: validateObject,
}

// Turn `error` into a RFC-7807 problem details object
const toStandard = function ({
  // eslint-disable-next-line no-unused-vars
  error: { name, message, stack, cause, errors, ...extra },
  options,
}) {
  return {
    title: String(name),
    details: String(message),
    stack: String(stack),
    ...(Object.keys(extra).length === 0 ? {} : { extra }),
    ...options,
  }
}

// eslint-disable-next-line import/no-default-export
export default {
  name: 'standard',
  getOptions,
  instanceMethods: { toStandard },
}
