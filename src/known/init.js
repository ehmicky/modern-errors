import isPlainObj from 'is-plain-obj'

import { setClassOpts } from '../plugins/class_opts.js'

import { getErrorClass } from './custom.js'

// Validate, normalize and create each error class.
// `setErrorName()` also checks that `name` is a string and is not one of the
// native error classes
export const initKnownClasses = function ({
  classesOpts,
  globalOpts,
  GlobalBaseError,
  errorData,
  plugins,
}) {
  return Object.fromEntries(
    Object.entries(classesOpts).map(([className, classOpts]) => [
      className,
      initKnownClass({
        className,
        classOpts,
        GlobalBaseError,
        errorData,
        plugins,
        globalOpts,
      }),
    ]),
  )
}

const initKnownClass = function ({
  className,
  classOpts,
  GlobalBaseError,
  errorData,
  plugins,
  globalOpts,
}) {
  if (!isPlainObj(classOpts)) {
    throw new TypeError(
      `The first argument's "${className}" property must be a plain object: ${classOpts}`,
    )
  }

  const { custom, ...classOptsA } = classOpts
  const ErrorClass = getErrorClass(custom, GlobalBaseError, className)
  setClassOpts({
    ErrorClass,
    globalOpts,
    classOpts: classOptsA,
    errorData,
    plugins,
  })
  return ErrorClass
}
