// eslint-disable-next-line filenames/match-exported
import isPlainObj from 'is-plain-obj'
import { codes } from 'statuses'

// Normalize and validate options
const getOptions = function (options = {}) {
  if (!isPlainObj(options)) {
    throw new TypeError(`It must be a plain object: ${options}`)
  }

  return Object.fromEntries(Object.entries(options).map(normalizeOption))
}

const normalizeOption = function ([optName, optValue]) {
  const validator = VALIDATORS[optName]

  if (validator === undefined) {
    const availableOpts = Object.keys(VALIDATORS).join(', ')
    throw new TypeError(`Unknown option "${optName}".
Available options: ${availableOpts}`)
  }

  if (optValue === undefined) {
    return []
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

const STATUSES = new Set(codes)

const validateURI = function (optValue, optName) {
  validateStatus(optValue, optName)

  try {
    // eslint-disable-next-line no-new
    new URL(optValue, EXAMPLE_ORIGIN)
  } catch (error) {
    throw new TypeError(
      `"${optValue}" must not be "${optValue}" but a valid URL: ${error.message}`,
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
    extra: String(extra),
    ...options,
  }
}

const STANDARD_PLUGIN = {
  name: 'stack',
  getOptions,
  instanceMethods: { toStandard },
}

// eslint-disable-next-line import/no-default-export
export default STANDARD_PLUGIN
