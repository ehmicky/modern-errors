import mergeErrorCause from 'merge-error-cause'

// Error handler that normalizes an error, merge its `error.cause` and ensure
// its type is among an allowed list of types.
// Otherwise, assign a default SystemError type.
// We purposely do not support subclassing Error types:
//  - This is usually not needed and the end result can be achieved differently
//  - This only adds complexity
// This returns the `error` instead of throwing it so the user can handle it
// before re-throwing it if needed.
export const callErrorHandler = function (
  { ErrorTypes, SystemError, bugsUrl },
  error,
) {
  const errorA = mergeErrorCause(error)

  if (ErrorTypes.includes(errorA.constructor)) {
    return errorA
  }

  const systemErrorMessage = getSystemErrorMessage(bugsUrl)
  const systemError = new SystemError(systemErrorMessage, { cause: errorA })
  return mergeErrorCause(systemError)
}

// If defined, the "bugsUrl" option prints a line recommend the error to report
// any SystemError.
// The option value can be the `bugs.url` field of `package.json`, which is
// easier to retrieve with JSON imports (Node >=16.14.0)
const getSystemErrorMessage = function (bugsUrl) {
  return bugsUrl === undefined ? '' : `Please report this bug at: ${bugsUrl}`
}
