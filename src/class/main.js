import { getClassOpts } from '../plugins/class_opts.js'

import { getErrorClass } from './custom.js'
import { validateClassName } from './name.js'
import { checkUnknownError } from './unknown.js'

// Create a new error class.
// The API is divided into two calls: creating `AnyError`, then creating each
// error class extending from `AnyError`:
//  - This makes it clear to users that they can reuse plugin methods
//  - This also makes it clearer to types, simplifying them
//  - This removes any need to mutate any `custom` class
export const createClass = function (
  { globalOpts, ParentError, AnyError, ErrorClasses, plugins },
  className,
  classOpts,
) {
  validateClassName(className, ErrorClasses)
  const { custom, classOpts: classOptsA } = getClassOpts(
    plugins,
    globalOpts,
    classOpts,
  )
  const ErrorClass = getErrorClass({
    ParentError,
    AnyError,
    className,
    custom,
    plugins,
  })
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(ErrorClass, 'class', {
    value: createClass.bind(undefined, {
      globalOpts,
      ParentError: ErrorClass,
      AnyError,
      ErrorClasses,
      plugins,
    }),
    enumerable: false,
    writable: true,
    configurable: true,
  })
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  ErrorClasses[className] = { ErrorClass, classOpts: classOptsA }
  checkUnknownError(ErrorClass, className)
  return ErrorClass
}
