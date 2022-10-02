import { getClassOpts } from '../plugins/class_opts.js'

import { getErrorClass } from './custom.js'
import { validateClassName } from './name.js'

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
export const addSubclass = function ({
  AnyError,
  globalOpts,
  ErrorClasses,
  plugins,
}) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  AnyError.subclass = createSubclass.bind(undefined, {
    parentOpts: globalOpts,
    ParentError: AnyError,
    AnyError,
    ErrorClasses,
    plugins,
  })
}

const createSubclass = function (
  { parentOpts, ParentError, AnyError, ErrorClasses, plugins },
  className,
  classOpts,
) {
  validateClassName(className, ErrorClasses)
  const { custom, classOpts: classOptsA } = getClassOpts({
    plugins,
    parentOpts,
    className,
    classOpts,
    AnyError,
  })
  const ErrorClass = getErrorClass({ ParentError, className, custom, plugins })
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(ErrorClass, 'subclass', {
    value: createSubclass.bind(undefined, {
      parentOpts: classOptsA,
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
  return ErrorClass
}
