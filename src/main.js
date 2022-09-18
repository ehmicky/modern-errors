import { createAnyError } from './base/main.js'
import { normalizeInput } from './input.js'
import { initKnownClasses } from './known/init.js'
import { addAllInstanceMethods } from './plugins/instance.js'
import { addAllStaticMethods } from './plugins/static.js'

// Creates error classes.
export default function modernErrors(classesOpts, plugins) {
  const {
    classesOpts: classesOptsA,
    globalOpts,
    plugins: pluginsA,
  } = normalizeInput(classesOpts, plugins)
  const KnownClasses = {}
  const errorData = new WeakMap()
  const AnyError = createAnyError(KnownClasses, errorData, pluginsA)
  addAllInstanceMethods({
    plugins: pluginsA,
    KnownClasses,
    errorData,
    AnyError,
  })
  addAllStaticMethods({ plugins: pluginsA, globalOpts, KnownClasses, AnyError })
  initKnownClasses({
    classesOpts: classesOptsA,
    globalOpts,
    AnyError,
    KnownClasses,
    errorData,
    plugins: pluginsA,
  })
  return { ...KnownClasses, AnyError }
}
