import { getClassOpts } from '../plugins/class_opts.js'

import { getErrorClass } from './custom.js'
import { validateClassName } from './name.js'
import { checkUnknownError } from './unknown.js'

// Validate, normalize and create an error class.
// `setErrorName()` also checks that `name` is a string and is not one of the
// native error classes
export const create = function (
  { globalOpts, AnyError, KnownClasses, errorData, plugins },
  className,
  classOpts,
) {
  validateClassName(className, KnownClasses)
  const { custom, classOpts: classOptsA } = getClassOpts(
    plugins,
    globalOpts,
    classOpts,
  )
  const ErrorClass = getErrorClass({ custom, AnyError, globalOpts, className })
  errorData.set(ErrorClass, { classOpts: classOptsA })
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  KnownClasses[className] = ErrorClass
  checkUnknownError(ErrorClass, className)
  return ErrorClass
}
