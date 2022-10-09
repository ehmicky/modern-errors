// Retrieve `info` passed to `plugin.properties()`
export const getPropertiesInfo = function ({
  ErrorClasses: { TestError: TestErrorClass },
  instanceOpts,
}) {
  return new TestErrorClass('test', instanceOpts).properties
}

// Retrieve `info` passed to `plugin.instanceMethods`
export const getInstanceInfo = function ({
  ErrorClasses: { TestError: TestErrorClass },
  instanceOpts,
  methodOpts,
}) {
  return new TestErrorClass('test', instanceOpts).getInstance(methodOpts)
}

// Retrieve `info` passed to `plugin.staticMethods`
export const getStaticInfo = function ({
  ErrorClasses: { AnyError: AnyErrorClass },
  methodOpts,
}) {
  return AnyErrorClass.getProp(methodOpts)
}
