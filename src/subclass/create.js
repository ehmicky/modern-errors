import { setErrorName } from 'error-class-utils'

import { normalizeClassOpts, getClassOpts } from '../options/class.js'
import { addAllInstanceMethods } from '../plugins/instance/main.js'
import { normalizePlugins } from '../plugins/shape/main.js'
import { addAllStaticMethods } from '../plugins/static/main.js'
import { setNonEnumProp } from '../utils/descriptors.js'

import { getErrorClass } from './custom.js'
import { classesData } from './map.js'
import { normalize } from './normalize.js'

// Create a new error class.
// We allow `ErrorClass.subclass()` to create subclasses. This can be used to:
//  - Share options and custom logic between error classes
//  - Bind and override options and custom logic between modules
//  - Only export parent classes to consumers
// We do not validate duplicate class names since sub-groups of classes might
// be used separately, explaining those duplicate names.
export const createSubclass = (ParentError, className, classOpts) => {
  const { classOpts: parentOpts, plugins: parentPlugins } =
    classesData.get(ParentError)
  const { custom, plugins, ...classOptsA } = normalizeClassOpts(
    ParentError,
    classOpts,
  )
  const ErrorClass = getErrorClass(ParentError, custom)
  addParentSubclass(ErrorClass, ParentError)
  return createClass({
    ParentError,
    ErrorClass,
    parentOpts,
    classOpts: classOptsA,
    parentPlugins,
    plugins,
    className,
  })
}

// Keep track of error subclasses, to use as `info.ErrorClasses` in plugins
const addParentSubclass = (ErrorClass, ParentError) => {
  const { subclasses, ...classProps } = classesData.get(ParentError)
  classesData.set(ParentError, {
    ...classProps,
    subclasses: [...subclasses, ErrorClass],
  })
}

// Unlike `createSubclass()`, this is run by the top-level `ModernError` as well
export const createClass = ({
  ParentError,
  ErrorClass,
  parentOpts,
  classOpts,
  parentPlugins,
  plugins,
  className,
}) => {
  const pluginsA = normalizePlugins(parentPlugins, plugins, ParentError)
  const classOptsA = getClassOpts(parentOpts, classOpts, pluginsA)
  classesData.set(ErrorClass, {
    classOpts: classOptsA,
    plugins: pluginsA,
    subclasses: [],
  })
  setErrorName(ErrorClass, className)
  setClassMethods(ErrorClass, pluginsA)
  return ErrorClass
}

const setClassMethods = (ErrorClass, plugins) => {
  setNonEnumProp(ErrorClass, 'normalize', normalize.bind(undefined, ErrorClass))
  setNonEnumProp(
    ErrorClass,
    'subclass',
    createSubclass.bind(undefined, ErrorClass),
  )
  addAllInstanceMethods(plugins, ErrorClass)
  addAllStaticMethods(plugins, ErrorClass)
}
