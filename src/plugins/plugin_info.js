// Retrieve `info` passed to all `plugin.*`
export const getPluginInfo = function ({
  options,
  AnyError,
  ErrorClasses,
  errorInfo,
}) {
  const ErrorClassesA = getErrorClasses(ErrorClasses)
  return { options, AnyError, ErrorClasses: ErrorClassesA, errorInfo }
}

// `ErrorClasses` are passed to all plugin methods.
// A shallow copy is done to prevent mutations.
const getErrorClasses = function (ErrorClasses) {
  return Object.fromEntries(Object.entries(ErrorClasses).map(getErrorClass))
}

const getErrorClass = function ([className, { ErrorClass }]) {
  return [className, ErrorClass]
}
