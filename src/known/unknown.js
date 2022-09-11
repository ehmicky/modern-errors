import normalizeException from 'normalize-exception'

// `UnknownError` is used by `new AnyError()` and `AnyError.normalize()`.
// It might have a custom constructor, which might be invalid. We try to check
// this by instantiating some test errors.
// We discourage extending or instantiating UnknownError but do not forbid it
// since:
//  - Users might not know instantiating would throw until runtime, which is
//    problematic in error handling logic
//  - There could be some potential use cases, e.g. if a branch is never meant
//    to happen unless some unknown bug happened
export const checkUnknownError = function ({ UnknownError }) {
  POSSIBLE_CAUSES.forEach((cause) => {
    checkUnknownErrorCause(UnknownError, cause)
  })
}

// Goes from least to most likely to throw
// eslint-disable-next-line unicorn/no-null
const POSSIBLE_CAUSES = [new Error('check'), {}, '', undefined, null]

const checkUnknownErrorCause = function (UnknownError, cause) {
  const unknownError = newUnknownError(UnknownError, cause)

  if (unknownError.constructor !== UnknownError) {
    throw new Error(
      "The UnknownError class's constructor is invalid: it does not return an UnknownError instance.",
    )
  }
}

const newUnknownError = function (UnknownError, cause) {
  try {
    return new UnknownError('', { cause })
  } catch (error) {
    const causeString =
      cause === POSSIBLE_CAUSES[0] ? '' : ` when the cause is ${cause}`
    throw new Error(`The UnknownError class's constructor is invalid.
It should not throw${causeString}.
${normalizeException(error).stack}`)
  }
}
