// Retrieve `info` passed to `plugin.properties()`
export const getPropertiesInfo = (ErrorClass, instanceOpts) =>
  new ErrorClass('test', instanceOpts).properties

// Retrieve `info` passed to `error.*(...)`
export const getInstanceInfo = (ErrorClass, instanceOpts, methodOpts) =>
  new ErrorClass('test', instanceOpts).getInstance(methodOpts)

// Retrieve `info` passed to `ErrorClass.*(error, ...)`
export const getMixInfo = (ErrorClass, instanceOpts, methodOpts) =>
  ErrorClass.getInstance(new ErrorClass('test', instanceOpts), methodOpts)

// Retrieve `info` passed to `ErrorClass.*(...)`
export const getStaticInfo = (ErrorClass, _, methodOpts) =>
  ErrorClass.getProp(methodOpts)

// Call either instance or static methods with specific method arguments and
// options
export const callInstanceMethod = (ErrorClass, ...args) =>
  new ErrorClass('message').getInstance(...args)

export const callMixMethod = (ErrorClass, ...args) =>
  ErrorClass.getInstance(new ErrorClass('message'), ...args)

export const callStaticMethod = (ErrorClass, ...args) =>
  ErrorClass.getProp(...args)
