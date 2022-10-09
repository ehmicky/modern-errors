// `unknownDeep` is a boolean passed to plugin methods.
// It is `true` if the error or any its `cause` (deeply) is unknown.
// This is meant to be used to know whether to print its stack trace.
// `UnknownError` instances and actual unknown errors have the same behavior:
//  - This is consistent with error wrapping and `bugs` URL which treats them
//    the same
//  - This allows user to opt-in to the same behavior as actual unknown errors
//    by using `new UnknownError()`
// In principle, only the innermost `cause` should be checked. We include any
// outer error as well to allow users to force showing the error stack by
// using `new UnknownError()`.
//  - For example, this is done on process errors by `modern-errors-process`
export const getUnknownDeep = function ({
  error,
  cause,
  ErrorClasses: {
    UnknownError: { ErrorClass: UnknownError },
  },
  errorData,
}) {
  return (
    error instanceof UnknownError ||
    (cause !== undefined && errorData.get(cause).unknownDeep)
  )
}
