import { createAnyError } from './base/main.js'
import { normalizeInput } from './input.js'
import { initKnownClasses } from './known/init.js'
import { checkUnknownError } from './known/unknown.js'

// Creates error classes.
export default function modernErrors(classesOpts, plugins) {
  const {
    classesOpts: classesOptsA,
    globalOpts,
    plugins: pluginsA,
  } = normalizeInput(classesOpts, plugins)
  const state = {}
  const errorData = new WeakMap()
  const AnyError = createAnyError({
    state,
    errorData,
    globalOpts,
    plugins: pluginsA,
  })
  const KnownClasses = initKnownClasses({
    classesOpts: classesOptsA,
    globalOpts,
    AnyError,
    errorData,
    plugins: pluginsA,
  })
  state.KnownClasses = KnownClasses
  checkUnknownError(KnownClasses)
  return { ...KnownClasses, AnyError }
}
