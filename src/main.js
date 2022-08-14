import createErrorTypes from 'create-error-types'
import { polyfill } from 'error-cause-polyfill'
import isPlainObj from 'is-plain-obj'
import mergeErrorCause from 'merge-error-cause'

// Create error types and returns an `errorHandler(error) => error` function to
// use as a top-level error handler.
// Also:
//  - merge `error.cause`, and polyfill it if unsupported
// `create-error-types` return value is a `Proxy`. We return it as is, but add
// more properties. We use inheritance to do so.
export default function modernErrors(opts) {
  polyfill()
  const { onCreate, bugsUrl } = getOpts(opts)
  const proxy = createErrorTypes({ onCreate, bugsUrl })
  const errorHandler = callErrorHandler.bind(undefined, proxy)
  const returnValue = { errorHandler }
  // eslint-disable-next-line fp/no-mutating-methods
  return Object.setPrototypeOf(returnValue, proxy)
}

// Normalize and retrieve options
const getOpts = function (opts = {}) {
  if (!isPlainObj(opts)) {
    throw new TypeError(`Options must be a plain object: ${opts}`)
  }

  const { onCreate, bugsUrl } = opts
  return { onCreate, bugsUrl }
}

// Apply `create-error-types` error handler and merge any `error.cause`.
const callErrorHandler = function (proxy, error) {
  const errorA = mergeErrorCause(error)
  const errorB = proxy.errorHandler(errorA)
  return errorB.name === 'InternalError' ? mergeErrorCause(errorB) : errorB
}
