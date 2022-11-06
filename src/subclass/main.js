import { setErrorName } from 'error-class-utils'

import { normalize } from '../any/normalize.js'
import { getClassOpts } from '../options/class.js'
import { addAllInstanceMethods } from '../plugins/instance/add.js'
import { addAllStaticMethods } from '../plugins/static/add.js'
import { setNonEnumProp } from '../utils/descriptors.js'

import { getErrorClass } from './custom.js'

// Create a new error class.
// We allow `ErrorClass.subclass()` to create subclasses. This can be used to:
//  - Share options and custom logic between error classes
//  - Bind and override options and custom logic between modules
//  - Only export parent classes to consumers
// We do not validate duplicate class names since sub-groups of classes might
// be used separately, explaining those duplicate names.
export const createSubclass = function ({
  ErrorClass,
  ErrorClasses,
  className,
  errorData,
  parentOpts,
  classOpts,
  plugins,
}) {
  const classOptsA = getClassOpts(plugins, parentOpts, classOpts)
  setErrorName(ErrorClass, className)
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  ErrorClasses[className] = { ErrorClass, classOpts: classOptsA }
  setNonEnumProp(ErrorClass, 'normalize', normalize.bind(undefined, ErrorClass))
  setNonEnumProp(ErrorClass, 'subclass', (childClassName, childClassOpts) =>
    createSubclass({
      ErrorClass: getErrorClass(ErrorClass, childClassOpts),
      ErrorClasses,
      className: childClassName,
      parentOpts: classOptsA,
      classOpts: childClassOpts,
      plugins,
    }),
  )
  addAllInstanceMethods({ plugins, ErrorClasses, ErrorClass, errorData })
  addAllStaticMethods({ plugins, ErrorClasses, ErrorClass, errorData })
  return ErrorClass
}
