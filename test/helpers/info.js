// Retrieve `info` passed to for `plugin.properties()`, `plugin.instanceMethods`
// or `plugin.staticMethods`
export const getPropertiesInfo = function (ErrorClass, instanceOpts) {
  return new ErrorClass('test', instanceOpts).properties
}

// Retrieve `info` passed to `plugin.instanceMethods`
export const getInstanceInfo = function (ErrorClass, instanceOpts, methodOpts) {
  return new ErrorClass('test', instanceOpts).getInstance(methodOpts)
}

// Retrieve `info` passed to `plugin.staticMethods`
export const getStaticInfo = function (ErrorClass, _, methodOpts) {
  return ErrorClass.getProp(methodOpts)
}

// Call either instance or static methods with specific method arguments and
// options
export const callInstanceMethod = function (ErrorClass, ...args) {
  return new ErrorClass('message').getInstance(...args)
}

export const callStaticMethod = function (ErrorClass, ...args) {
  return ErrorClass.getProp(...args)
}
