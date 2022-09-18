import { createAnyError } from './base/main.js'
import { normalizeInput } from './input.js'
import { initKnownClasses } from './known/init.js'

// Creates error classes.
export default function modernErrors(classesOpts, plugins) {
  const {
    classesOpts: classesOptsA,
    globalOpts,
    plugins: pluginsA,
  } = normalizeInput(classesOpts, plugins)
  const KnownClasses = {}
  const errorData = new WeakMap()
  const AnyError = createAnyError({
    KnownClasses,
    errorData,
    globalOpts,
    plugins: pluginsA,
  })
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
