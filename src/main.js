// Include a polyfill for `error.cause` for Node.js <16.9.0 and old browsers.
// eslint-disable-next-line n/file-extension-in-import, import/no-unassigned-import, import/no-unresolved
import 'error-cause-polyfill/auto'

import { callErrorHandler } from './handler.js'
import { getOpts } from './opts.js'
import { createProxy } from './proxy.js'
import { createInternalError } from './types.js'

// Create error.
// Also returns an `errorHandler(error) => error` function to use as a top-level
// error handler.
export default function modernErrors(opts) {
  const { onCreate, bugsUrl } = getOpts(opts)
  const InternalError = createInternalError()
  const state = {}
  state.errorHandler = callErrorHandler.bind(undefined, {
    state,
    InternalError,
    bugsUrl,
  })
  return createProxy(state, onCreate)
}
