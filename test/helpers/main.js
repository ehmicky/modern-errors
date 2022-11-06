import ModernError from 'modern-errors'

import { TEST_PLUGIN } from './plugin.js'

export { ModernError }

export const getPluginClasses = function () {
  return getClasses({ plugins: [TEST_PLUGIN] })
}

export const getClasses = function (opts) {
  const AnyError = ModernError.subclass('AnyError', opts)
  const ChildError = AnyError.subclass('ChildError')
  const ErrorSubclassesArg = [AnyError, ChildError]
  const ErrorClassesArg = [ModernError, ...ErrorSubclassesArg]
  return { ErrorClasses: ErrorClassesArg, ErrorSubclasses: ErrorSubclassesArg }
}

export const { ErrorClasses, ErrorSubclasses } = getClasses()
