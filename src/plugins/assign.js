import { excludeKeys } from 'filter-obj'
import isPlainObj from 'is-plain-obj'
import setErrorMessage from 'set-error-message'
import setErrorProps from 'set-error-props'

// `plugin.set()` and `unset()` return an object of properties to set.
// `undefined` values delete properties.
// Those are shallowly merged.
// Error core properties are ignored except for `message`.
export const assignError = function ({ error, newProps, plugin, methodName }) {
  if (!isPlainObj(newProps)) {
    throw new TypeError(
      `Plugin "${plugin.name}" "${methodName}()" must return a plain object`,
    )
  }

  const { message, ...newPropsA } = newProps

  if (message !== undefined) {
    setErrorMessage(error, message)
  }

  if (Reflect.ownKeys(newPropsA).length === 0) {
    return
  }

  const newPropsB = excludeKeys(newPropsA, OMITTED_PROPS)
  setErrorProps(error, newPropsB)
}

// Reserved top-level properties do not throw: they are silently omitted instead
// since `newProps` might be dynamically generated making it cumbersome for user
// to filter those.
const OMITTED_PROPS = ['wrap', 'constructorArgs']
