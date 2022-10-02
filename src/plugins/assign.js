import { excludeKeys } from 'filter-obj'
import setErrorMessage from 'set-error-message'
import setErrorProps from 'set-error-props'

// `plugin.set()` returns an object of properties to set.
// `undefined` values delete properties.
// Those are shallowly merged.
// Error core properties are ignored except for `message` and `stack`.
export const assignError = function (error, { message, stack, ...newProps }) {
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

  if (Reflect.ownKeys(newProps).length !== 0) {
    setErrorProps(error, excludeKeys(newProps, OMITTED_PROPS))
  }
}

// Reserved top-level properties do not throw: they are silently omitted instead
// since `newProps` might be dynamically generated making it cumbersome for user
// to filter those.
const OMITTED_PROPS = ['wrap', 'constructorArgs']
