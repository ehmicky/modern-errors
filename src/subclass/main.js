import { setErrorName } from 'error-class-utils'

import { normalize } from '../any/normalize.js'
import { normalizeClassOpts, getClassOpts } from '../options/class.js'
import { addAllInstanceMethods } from '../plugins/instance/add.js'
import { normalizePlugins } from '../plugins/shape/main.js'
import { mergePluginOpts } from '../plugins/shape/merge.js'
import { addAllStaticMethods } from '../plugins/static/add.js'
import { setNonEnumProp } from '../utils/descriptors.js'

import { getErrorClass } from './custom.js'
import { ERROR_CLASSES } from './map.js'

// Create a new error class.
// We allow `ErrorClass.subclass()` to create subclasses. This can be used to:
//  - Share options and custom logic between error classes
//  - Bind and override options and custom logic between modules
//  - Only export parent classes to consumers
// We do not validate duplicate class names since sub-groups of classes might
// be used separately, explaining those duplicate names.
export const createSubclass = function (ParentError, className, classOpts) {
  const { classOpts: parentOpts, plugins: parentPluginsOpt } =
    ERROR_CLASSES.get(ParentError)
  const {
    custom,
    plugins: pluginsOpt,
    ...classOptsA
  } = normalizeClassOpts(ParentError, classOpts)
  const ErrorClass = getErrorClass(ParentError, custom)
  const pluginsOptA = mergePluginOpts(parentPluginsOpt, pluginsOpt)
  const plugins = normalizePlugins(pluginsOptA)
  const classOptsB = getClassOpts(parentOpts, classOptsA, plugins)
  ERROR_CLASSES.set(ErrorClass, { classOpts: classOptsB, plugins })
  setErrorName(ErrorClass, className)
  setClassMethods(ErrorClass, plugins)
  return ErrorClass
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
