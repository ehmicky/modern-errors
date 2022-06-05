import errorType from 'error-type'

// Validate first argument `errorNames`
export const validateErrorNames = function (errorNames) {
  if (!Array.isArray(errorNames)) {
    throw new TypeError(
      `First argument must be an array of error names: ${errorNames}`,
    )
  }

  errorNames.forEach(validateErrorName)
}

const validateErrorName = function (errorName) {
  if (typeof errorName !== 'string') {
    throw new TypeError(`Error name must be a string: ${errorName}`)
  }

  if (errorName === SYSTEM_ERROR_NAME) {
    throw new Error(`Error name must not be "${SYSTEM_ERROR_NAME}".
"${SYSTEM_ERROR_NAME}" is reserved for exceptions matching none of the error types.`)
  }
}

// Create the SystemError type used for unknown error types.
// We purposely do not export this type nor expose it except through
// `error.name` because:
//  - Users do not need it throw system errors since any uncaught error will be
//    converted to it
//  - This ensures instantiating a system error never throws
//  - This makes the API simpler, stricter and more consistent
export const createSystemError = function () {
  return errorType(SYSTEM_ERROR_NAME)
}

const SYSTEM_ERROR_NAME = 'SystemError'

// Custom error `onCreate()` logic can be specified
//  - To make it type-specific, an object of functions should be used, then
//    `object[error.name]` should be used inside `onCreate()`
export const createErrorTypes = function (errorNames, onCreate) {
  return Object.fromEntries(
    errorNames.map((errorName) => [errorName, errorType(errorName, onCreate)]),
  )
}
