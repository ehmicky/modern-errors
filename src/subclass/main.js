import { setErrorName } from 'error-class-utils'

import { normalize } from '../any/normalize.js'
import { getClassOpts } from '../options/class.js'
import { addAllInstanceMethods } from '../plugins/instance/add.js'
import { addAllStaticMethods } from '../plugins/static/add.js'
import { setNonEnumProp } from '../utils/descriptors.js'

import { getErrorClass } from './custom.js'

// Create a new error class.
// The API is divided into two calls: creating `AnyError`, then creating each
// error class extending from `AnyError`:
//  - This makes it clear to users that they can reuse plugin methods
//  - This also makes it clearer to types, simplifying them
//  - This removes any need to mutate any `custom` class
// We allow `ErrorClass.subclass()` to create subclasses. This can be used to:
//  - Share options and custom logic between error classes
//  - Bind and override options and custom logic between modules
//  - Only export parent classes to consumers
export const createSubclass = function ({
  ErrorClass,
  ErrorClasses,
  AnyError,
  className,
  errorData,
  parentOpts,
  classOpts,
  plugins,
}) {
  validateClassName(className, ErrorClasses)
  const classOptsA = getClassOpts(plugins, parentOpts, classOpts)
  setErrorName(ErrorClass, className)
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  ErrorClasses[className] = { ErrorClass, classOpts: classOptsA }
  setNonEnumProp(
    ErrorClass,
    'normalize',
    normalize.bind(undefined, { ErrorClass, AnyError }),
  )
  setNonEnumProp(ErrorClass, 'subclass', (childClassName, childClassOpts) =>
    createSubclass({
      ErrorClass: getErrorClass(ErrorClass, childClassOpts),
      ErrorClasses,
      AnyError,
      className: childClassName,
      parentOpts: classOptsA,
      classOpts: childClassOpts,
      plugins,
    }),
  )
  addAllInstanceMethods({
    plugins,
    ErrorClasses,
    ErrorClass,
    errorData,
  })
  addAllStaticMethods({
    plugins,
    ErrorClasses,
    ErrorClass,
    errorData,
  })
  return ErrorClass
}

const validateClassName = function (className, ErrorClasses) {
  if (ErrorClasses[className] !== undefined) {
    throw new TypeError(`Error class "${className}" has already been defined.`)
  }
}
