import mergeErrorCause from 'merge-error-cause'

// Retrieve `error.cause` unless it is unknown
export const getCause = function ({ cause }, AnyError) {
  return cause instanceof AnyError ? cause : undefined
}

// `error.cause` is merged as soon as the error is instantiated:
//  - This is simpler as it avoids the error shape to change over its lifetime
//    (before|after `AnyError.normalize()`)
//  - This makes it easier to debug that merging itself
//  - This allow benefitting from `cause` merging before `AnyError.normalize()`,
//    e.g. for improved debugging
// `error`'s class is used over `error.cause`'s since:
//  - `AnyError` can be used to reverse this
//  - This ensures the instance class is the same as the constructor being used,
//    which is expected
//     - `AnyError` class does not change, but only to a child class
//  - Setting a class only if `error.cause`'s class is unknown can sometimes
//    be needed
//     - However it usually indicates a catch block that is too wide, which
//       is discouraged
export const mergeCause = function (error, wrap) {
  error.wrap = wrap
  return mergeErrorCause(error)
}
