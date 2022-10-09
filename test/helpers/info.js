// Retrieve `info` passed to `plugin.properties()`
export const getPropertiesInfo = function ({ ErrorClasses, instanceOpts }) {
  return new ErrorClasses.TestError('test', instanceOpts).properties
}

// Retrieve `info` passed to `plugin.instanceMethods`
export const getInstanceInfo = function ({
  ErrorClasses,
  instanceOpts,
  methodOpts,
}) {
  return new ErrorClasses.TestError('test', instanceOpts).getInstance(
    methodOpts,
  )
}

// Retrieve `info` passed to `plugin.staticMethods`
export const getStaticInfo = function ({ ErrorClasses, methodOpts }) {
  return ErrorClasses.AnyError.getProp(methodOpts)
}
