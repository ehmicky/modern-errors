import { deepClone } from './clone.js'

// When an error is wrapped, the parent error overrides the child error's
// options.
//  - We do this by keeping track of values modified by `plugin.properties()`,
//    then revert them when wrapped
// Calling all plugins `plugin.properties()`, even if their options is not
// specified, also ensures they get refreshed
//  - E.g. the `bugs` plugin bumps the bugs URL to the bottom of `error.message`
// `AnyError` does it as well, but first merges the child's options with its
// own options.
// Why the outer error overrides inner's options:
//  - This is consistent with class merging, where the outer class has priority
//    by default
//  - This is consistent with the usual pattern where the last operation has
//    merging priority (e.g. `Object.assign()`, etc.)
//  - Options are often specific to a class
//     - Even when set as an instance options
//        - Also, distinguishing class from instance options is hard since
//          custom constructors might pass either to `super()`
//     - Mixing different errors' options could set options to classes where
//       they do not belong
//     - Users can use manual logic to reuse the inner's error properties,
//       after applying `AnyError.normalize()`
// This also keeps options merging with inner error separate and orthogonal
// from merging its class, message and stack.
export const getPreviousValues = function (newProps, error) {
  return getValues(getPreviousKeys(newProps), error)
}

// Setting `message` also updates the `stack`
const getPreviousKeys = function (newProps) {
  const previousKeys = Reflect.ownKeys(newProps)
  return previousKeys.includes('message') && !previousKeys.includes('stack')
    ? [...previousKeys, 'stack']
    : previousKeys
}

// Keep track of the `newValues` so that reverting to `previousValues` can
// itself be reverted.
// An alternative would be cloning errors, but it is hard to implement since:
//  - Private variables would not be kept
//  - Properties that are class instances would not be cloned
//  - Constructor might throw while cloning due to change in either:
//     - Global scope
//     - Class instance passed as argument
export const getAllValues = function (previousValues, error) {
  const previousValuesA = filterPreviousValues(previousValues, error)
  const newValues = getNewValues(previousValuesA, error)
  return { previousValues: previousValuesA, newValues }
}

// Only keep `previousValues` that:
//  - Have not been ignored by `set-error-props` (e.g. core properties)
//  - Were different either:
//     - Different value (including addition or deletion)
//     - Initial value was inherited, and is now an own property
const filterPreviousValues = function (previousValues, error) {
  const previousValuesA = previousValues.filter((previousValue) =>
    hasChanged(previousValue, error),
  )
  return deepClone(previousValuesA)
}

const hasChanged = function ({ key, descriptor }, error) {
  const newDescriptor = Object.getOwnPropertyDescriptor(error, key)

  if (newDescriptor === undefined) {
    return descriptor !== undefined
  }

  return descriptor === undefined || descriptor.value !== newDescriptor.value
}

const getNewValues = function (previousValues, error) {
  return getValues(previousValues.map(getKey), error)
}

const getKey = function ({ key }) {
  return key
}

const getValues = function (keys, error) {
  return keys.map((key) => getValue(key, error))
}

const getValue = function (key, error) {
  const descriptor = Object.getOwnPropertyDescriptor(error, key)
  return { key, descriptor }
}

// When an error is wrapped, undo its `plugin.properties()` before merging it to
// the parent
export const restorePreviousValues = function (cause, errorData) {
  if (cause !== undefined) {
    restoreValues(cause, errorData.get(cause).previousValues)
  }
}

// Revert it after the parent has used the cause, so it remains unchanged.
// Not done if parent is `new AnyError()` since `cause` is then returned.
export const restoreNewValues = function (cause, errorData, isAnyError) {
  if (cause !== undefined && !isAnyError) {
    restoreValues(cause, errorData.get(cause).newValues)
  }
}

const restoreValues = function (cause, values) {
  values.forEach((value) => {
    restoreValue(cause, value)
  })
}

const restoreValue = function (cause, { key, descriptor }) {
  if (descriptor === undefined) {
    // eslint-disable-next-line fp/no-delete, no-param-reassign
    delete cause[key]
  } else {
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(cause, key, descriptor)
  }
}
