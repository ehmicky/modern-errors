// Retrieve `info` passed to `plugin.properties()`
export const getPropertiesInfo = function (ErrorClass, instanceOpts) {
  return new ErrorClass('test', instanceOpts).properties
}

// Retrieve `info` passed to `error.*(...)`
export const getInstanceInfo = function (ErrorClass, instanceOpts, methodOpts) {
  return new ErrorClass('test', instanceOpts).getInstance(methodOpts)
}

// Retrieve `info` passed to `ErrorClass.*(error, ...)`
export const getMixInfo = function (ErrorClass, instanceOpts, methodOpts) {
  return ErrorClass.getInstance(
    new ErrorClass('test', instanceOpts),
    methodOpts,
  )
}

// Retrieve `info` passed to `ErrorClass.*(...)`
export const getStaticInfo = function (ErrorClass, _, methodOpts) {
  return ErrorClass.getProp(methodOpts)
}

// Call either instance or static methods with specific method arguments and
// options
export const callInstanceMethod = function (ErrorClass, ...args) {
  return new ErrorClass('message').getInstance(...args)
}

export const callMixMethod = function (ErrorClass, ...args) {
  return ErrorClass.getInstance(new ErrorClass('message'), ...args)
}

export const callStaticMethod = function (ErrorClass, ...args) {
  return ErrorClass.getProp(...args)
}
