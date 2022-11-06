import { setErrorName } from 'error-class-utils'

import { normalize } from '../any/normalize.js'
import { normalizeClassOpts, getClassOpts } from '../options/class.js'
import { addAllInstanceMethods } from '../plugins/instance/add.js'
import { normalizePlugins } from '../plugins/shape/main.js'
import { addAllStaticMethods } from '../plugins/static/add.js'
import { setNonEnumProp } from '../utils/descriptors.js'

import { getErrorClass } from './custom.js'
import { classesData } from './map.js'

// Create a new error class.
// We allow `ErrorClass.subclass()` to create subclasses. This can be used to:
//  - Share options and custom logic between error classes
//  - Bind and override options and custom logic between modules
//  - Only export parent classes to consumers
// We do not validate duplicate class names since sub-groups of classes might
// be used separately, explaining those duplicate names.
export const createSubclass = function (ParentError, className, classOpts) {
  const {
    ErrorClass,
    classOpts: classOptsA,
    plugins,
  } = applyClassOpts(ParentError, classOpts)
  classesData.set(ErrorClass, {
    classOpts: classOptsA,
    plugins,
    subclasses: [],
  })
  addParentSubclass(ErrorClass, ParentError)
  setErrorName(ErrorClass, className)
  setClassMethods(ErrorClass, plugins)
  return ErrorClass
}

const applyClassOpts = function (ParentError, classOpts) {
  const { classOpts: parentOpts, plugins: parentPlugins } =
    classesData.get(ParentError)
  const { custom, plugins, ...classOptsA } = normalizeClassOpts(
    ParentError,
    classOpts,
  )
  const ErrorClass = getErrorClass(ParentError, custom)
  const pluginsA = normalizePlugins(parentPlugins, plugins, ParentError)
  const classOptsB = getClassOpts(parentOpts, classOptsA, pluginsA)
  return { ErrorClass, classOpts: classOptsB, plugins: pluginsA }
}

const addParentSubclass = function (ErrorClass, ParentError) {
  const { subclasses, ...classProps } = classesData.get(ParentError)
  classesData.set(ParentError, {
    ...classProps,
    subclasses: [...subclasses, ErrorClass],
  })
}

const setClassMethods = function (ErrorClass, plugins) {
  setNonEnumProp(ErrorClass, 'normalize', normalize.bind(undefined, ErrorClass))
  setNonEnumProp(
    ErrorClass,
    'subclass',
    createSubclass.bind(undefined, ErrorClass),
  )
  addAllInstanceMethods(plugins, ErrorClass)
  addAllStaticMethods(plugins, ErrorClass)
}
