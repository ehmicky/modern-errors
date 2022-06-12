// Include a polyfill for `error.cause` for Node.js <16.9.0 and old browsers.
// eslint-disable-next-line n/file-extension-in-import, import/no-unassigned-import
import 'error-cause/auto'

import { onErrorHandler } from './handler.js'
import { getOpts } from './opts.js'
import {
  validateErrorNames,
  createSystemError,
  createErrorTypes,
} from './types.js'

// Create error types by passing an array of error names.
// Also returns an `onError(error) => error` function to use as a top-level
// error handler.
// Consumers should check for `error.name`
//  - As opposed to using `instanceof`
//  - This removes the need to import/export error types
//  - This also works cross-realm
// There is no source maps support: instead users can use:
//  - Node.js: `--enable-source-maps` flag
//  - Chrome: `node-source-map-support`
//  - Any browsers: `stacktrace.js`
export default function modernErrors(errorNames, opts) {
  validateErrorNames(errorNames)
  const { onCreate, bugsUrl } = getOpts(opts)
  const SystemError = createSystemError()
  const ErrorTypes = createErrorTypes(errorNames, onCreate)
  const onError = onErrorHandler.bind(undefined, {
    ErrorTypes: Object.values(ErrorTypes),
    SystemError,
    bugsUrl,
  })
  return { ...ErrorTypes, onError }
}
