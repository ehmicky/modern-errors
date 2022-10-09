// Retrieve `info` passed to `plugin.properties|instanceMethods`, but not
// `staticMethods` since it does not have access to an error.
export const getErrorPluginInfo = function ({
  error,
  AnyError,
  ErrorClasses,
  errorInfo,
}) {
  const { options, unknownDeep } = errorInfo(error)
  const info = getPluginInfo({ options, AnyError, ErrorClasses, errorInfo })
  return { ...info, error, unknownDeep }
}

// Retrieve `info` passed to `plugin.properties|instanceMethods|staticMethods`
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
