// `unknownDeep` is a boolean passed to plugin methods.
// It is `true` when the innermost `error.cause` is an unknown error.
// This is useful to distinguish when the innermost error came from an
// external library or was an unexpected runtime error.
//  - For example, to known whether the stack trace and error properties should
//    be printed
// `UnknownError` instances are considered unknown although they are `AnyError`
// instances. This is the same behave as error that are not `AnyError`
// instances. This is because:
//  - This is consistent with error wrapping and `bugs` URL which treats them
//    the same
//  - This allows user to opt-in to the same behavior as actual unknown errors
//    by using `UnknownError`
export const getUnknownDeep = function ({
  cause,
  AnyError,
  ErrorClasses: {
    UnknownError: { ErrorClass: UnknownError },
  },
  errorData,
}) {
  return (
    cause === undefined ||
    !(cause instanceof AnyError) ||
    cause instanceof UnknownError ||
    errorData.get(cause).unknownDeep
  )
}
