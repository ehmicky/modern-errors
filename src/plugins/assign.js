import { excludeKeys } from 'filter-obj'
import setErrorMessage from 'set-error-message'
import setErrorProps from 'set-error-props'

import { getPluginsMethodNames } from './instance/add.js'

// `plugin.properties()` returns an object of properties to set.
// `undefined` values delete properties.
// Those are shallowly merged.
// Many properties are ignored:
//  - error core properties (except for `message` and `stack`)
//  - reserved top-level properties like `constructorArgs`
//  - instance methods
// Setting those does not throw since:
//  - `plugin.properties()`'s return value might be dynamically generated
//    making it cumbersome for user to filter those.
//  - Throwing errors at runtime should be done with care since this would
//    happen during error handling time
export const assignError = function (
  error,
  { message, stack, ...newProps },
  plugins,
) {
  if (stack !== undefined) {
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(error, 'stack', {
      value: stack,
      enumerable: false,
      writable: true,
      configurable: true,
    })
  }

  if (message !== undefined) {
    setErrorMessage(error, message)
  }

  if (Reflect.ownKeys(newProps).length === 0) {
    return
  }

  const keys = excludeKeys(newProps, [
    ...OMITTED_PROPS,
    ...getPluginsMethodNames(plugins),
  ])
  setErrorProps(error, keys)
}

const OMITTED_PROPS = ['wrap', 'constructorArgs']
