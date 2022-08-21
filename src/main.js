import createErrorTypes from 'create-error-types'
import { polyfill } from 'error-cause-polyfill'
import isPlainObj from 'is-plain-obj'
import mergeErrorCause from 'merge-error-cause'

import { setErrorClassesToJSON, parseValue } from './serialize.js'

// Create error classes and returns an `errorHandler(error) => error` function
// to use as a top-level error handler.
// Also:
//  - merge `error.cause`, and polyfill it if unsupported
export default function modernErrors(errorNames, opts) {
  polyfill()
  const { onCreate, bugsUrl } = getOpts(opts)
  const { errorHandler: innerHandler, ...CustomErrorClasses } =
    createErrorTypes(errorNames, { onCreate, bugsUrl })
  const errorHandler = callErrorHandler.bind(undefined, innerHandler)
  setErrorClassesToJSON(CustomErrorClasses)
  const parse = parseValue.bind(undefined, CustomErrorClasses)
  return { ...CustomErrorClasses, errorHandler, parse }
}

// Normalize and retrieve options
const getOpts = function (opts = {}) {
  if (!isPlainObj(opts)) {
    throw new TypeError(`Options must be a plain object: ${opts}`)
  }

  return opts
}

// Apply `create-error-types` error handler and merge any `error.cause`.
const callErrorHandler = function (innerHandler, error) {
  const errorA = mergeErrorCause(error)
  const errorB = innerHandler(errorA)
  return mergeErrorCause(errorB)
}
