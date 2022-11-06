import ModernError from 'modern-errors'

import { TEST_PLUGIN } from './plugin.js'

export const defineClassesOpts = function (ErrorClasses, opts) {
  const AnyError = createAnyError(opts)
  const ErrorClassesA =
    typeof ErrorClasses === 'function' ? ErrorClasses(AnyError) : ErrorClasses
  const ErrorClassesB = Object.fromEntries(
    Object.entries(ErrorClassesA).map(([errorName, classOpts]) => [
      errorName,
      AnyError.subclass(errorName, classOpts),
    ]),
  )
  return { ModernError, AnyError, ...ErrorClassesB }
}

const createAnyError = function ({ plugins = [TEST_PLUGIN], ...opts } = {}) {
  return ModernError.subclass('AnyError', { ...opts, plugins })
}
