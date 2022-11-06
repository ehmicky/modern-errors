// Retrieve `info` passed to `plugin.properties()`
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
