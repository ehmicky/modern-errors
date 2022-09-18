import isPlainObj from 'is-plain-obj'

import { setClassOpts } from '../plugins/class_opts.js'

import { getErrorClass, createGlobalAnyError } from './custom.js'
import { validateClassesOpts } from './input.js'
import { checkUnknownError } from './unknown.js'

// Validate, normalize and create each error class.
// `setErrorName()` also checks that `name` is a string and is not one of the
// native error classes
export const create = function (
  { globalOpts, AnyError, KnownClasses, errorData, plugins },
  classesOpts,
) {
  validateClassesOpts(classesOpts)
  const GlobalAnyError = createGlobalAnyError(globalOpts, AnyError)
  Object.entries(classesOpts).forEach(([className, classOpts]) => {
    initKnownClass({
      className,
      classOpts,
      GlobalAnyError,
      AnyError,
      KnownClasses,
      errorData,
      plugins,
      globalOpts,
    })
  })
  return KnownClasses
}

const initKnownClass = function ({
  className,
  classOpts,
  GlobalAnyError,
  AnyError,
  KnownClasses,
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
  const ErrorClass = getErrorClass({
    custom,
    AnyError,
    GlobalAnyError,
    className,
  })
  setClassOpts({
    ErrorClass,
    globalOpts,
    classOpts: classOptsA,
    errorData,
    plugins,
  })
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  KnownClasses[className] = ErrorClass
  checkUnknownError(ErrorClass, className)
}
