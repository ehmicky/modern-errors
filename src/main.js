import { createAnyError } from './any/main.js'
import { createBaseError } from './base/main.js'
import { normalizeInput } from './input.js'
import { initKnownClasses } from './known/main.js'
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
  const BaseError = createBaseError(state, errorData, pluginsA)
  state.AnyError = createAnyError({
    state,
    globalOpts,
    BaseError,
    plugins: pluginsA,
  })
  state.KnownClasses = initKnownClasses({
    classesOpts: classesOptsA,
    globalOpts,
    BaseError,
    errorData,
    plugins: pluginsA,
  })
  checkUnknownError(state.KnownClasses)
  return { ...state.KnownClasses, AnyError: state.AnyError }
}
