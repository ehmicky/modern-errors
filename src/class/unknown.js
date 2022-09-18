import normalizeException from 'normalize-exception'

// `UnknownError` is used by `new AnyError()` and `AnyError.normalize()`.
// Therefore, it is required.
// We do not automatically create `UnknownError` to encourage exporting it and
// optionally configuring it.
export const requireUnknownError = function (ErrorClasses) {
  if (Object.keys(ErrorClasses).length === 0) {
    throw new Error(`At least one error class must be created.
This is done by calling "AnyError.class()".`)
  }

  if (ErrorClasses.UnknownError === undefined) {
    throw new Error(`One of the error classes must be named "UnknownError".
This is done by calling "AnyError.class('UnknownError')".
"UnknownError" is assigned by "AnyError.normalize()" to exceptions with an unknown class.`)
  }
}

// It might have a custom constructor, which might be invalid. We try to check
// this by instantiating some test errors.
// We discourage extending or instantiating UnknownError but do not forbid it
// since:
//  - Users might not know instantiating would throw until runtime, which is
//    problematic in error handling logic
//  - There could be some potential use cases, e.g. if a branch is never meant
//    to happen unless some unknown bug happened
export const checkUnknownError = function (ErrorClass, className) {
  if (className !== 'UnknownError') {
    return
  }

  POSSIBLE_CAUSES.forEach((cause, index) => {
    checkUnknownErrorCause(ErrorClass, cause, index === 0)
  })
}

const CHECK_MESSAGE = 'unknownErrorCheck'
// Goes from least to most likely to throw
// eslint-disable-next-line unicorn/no-null
const POSSIBLE_CAUSES = [new Error(CHECK_MESSAGE), {}, '', undefined, null]

const checkUnknownErrorCause = function (UnknownError, cause, firstCheck) {
  const unknownError = newUnknownError(UnknownError, cause, firstCheck)
  checkReturnType(unknownError, UnknownError)
  checkSuper(unknownError, firstCheck)
}

const newUnknownError = function (UnknownError, cause, firstCheck) {
  try {
    return new UnknownError('', { cause })
  } catch (error) {
    const causeString = firstCheck ? '' : ` when the cause is ${cause}`
    throw new Error(
      `${MESSAGE_PREFIX}It should not throw${causeString}.\n${
        normalizeException(error).stack
      }`,
    )
  }
}

const checkReturnType = function (unknownError, UnknownError) {
  if (!(unknownError instanceof Error)) {
    throw new TypeError(
      `${MESSAGE_PREFIX}It does not return an Error instance.`,
    )
  }

  if (unknownError.constructor !== UnknownError) {
    throw new Error(
      `${MESSAGE_PREFIX}It does not return an UnknownError instance.`,
    )
  }
}

const checkSuper = function (unknownError, firstCheck) {
  if (firstCheck && !unknownError.message.includes(CHECK_MESSAGE)) {
    throw new Error(
      `${MESSAGE_PREFIX}"super(message, options)" must be called with both arguments.`,
    )
  }
}

const MESSAGE_PREFIX = "The UnknownError class's constructor is invalid.\n"
