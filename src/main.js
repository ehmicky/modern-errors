// Include a polyfill for `error.cause` for Node.js <16.9.0 and old browsers.
// eslint-disable-next-line n/file-extension-in-import, import/no-unassigned-import
import 'error-cause/auto'

import { callErrorHandler } from './handler.js'
import { getOpts } from './opts.js'
import { createProxy } from './proxy.js'
import { createSystemError } from './types.js'

// Create error.
// Also returns an `errorHandler(error) => error` function to use as a top-level
// error handler.
// Consumers should check for `error.name`
//  - As opposed to using `instanceof`
//  - This removes the need to import/export error types
//  - This also works cross-realm
// There is no source maps support: instead users can use:
//  - Node.js: `--enable-source-maps` flag
//  - Chrome: `node-source-map-support`
//  - Any browsers: `stacktrace.js`
export default function modernErrors(opts) {
  const { onCreate, bugsUrl } = getOpts(opts)
  const SystemError = createSystemError()
  const state = {}
  state.errorHandler = callErrorHandler.bind(undefined, {
    state,
    SystemError,
    bugsUrl,
  })
  return createProxy(state, onCreate)
}
