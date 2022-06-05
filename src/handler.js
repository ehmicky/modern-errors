import mergeErrorCause from 'merge-error-cause'

// Error handler that normalizes an error, merge its `error.cause` and ensure
// its type is among an allowed list of types.
// Otherwise, assign a default SystemError type.
export const onErrorHandler = function (
  { ErrorTypes, SystemError, bugsUrl },
  error,
) {
  const errorA = mergeErrorCause(error)

  if (ErrorTypes.some((ErrorType) => errorA instanceof ErrorType)) {
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
