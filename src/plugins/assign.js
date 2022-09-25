import isPlainObj from 'is-plain-obj'
import setErrorMessage from 'set-error-message'
import setErrorProps from 'set-error-props'

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

  if (Reflect.ownKeys(newPropsA).length !== 0) {
    setErrorProps(error, newPropsA)
  }
}
