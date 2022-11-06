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
export const createSubclass = function ({
  ErrorClass,
  className,
  parentOpts,
  classOpts,
}) {
  const {
    classOpts: classOptsA,
    pluginsOpt,
    plugins,
  } = listClassOpts(parentOpts, classOpts)
  ERROR_CLASSES.set(ErrorClass, { classOpts: classOptsA, plugins })
  setErrorName(ErrorClass, className)
  setNonEnumProp(ErrorClass, 'normalize', normalize.bind(undefined, ErrorClass))
  setNonEnumProp(ErrorClass, 'subclass', (childClassName, childClassOpts) =>
    createSubclass({
      ErrorClass: getErrorClass(ErrorClass, childClassOpts),
      className: childClassName,
      parentOpts: { ...classOptsA, plugins: pluginsOpt },
      classOpts: childClassOpts,
    }),
  )
  addAllInstanceMethods(plugins, ErrorClass)
  addAllStaticMethods(plugins, ErrorClass)
  return ErrorClass
}

const listClassOpts = function (parentOpts, classOpts) {
  const classOptsA = normalizeClassOpts(classOpts)
  const pluginsOpt = mergePluginOpts(parentOpts, classOptsA)
  const plugins = normalizePlugins(pluginsOpt)
  const classOptsB = getClassOpts(parentOpts, classOptsA, plugins)
  return { classOpts: classOptsB, pluginsOpt, plugins }
}
