import ModernError from 'modern-errors'

import { TEST_PLUGIN } from './plugin.js'

export { ModernError }

export const getPluginClasses = function () {
  return getClasses({ plugins: [TEST_PLUGIN] })
}

export const getClasses = function (opts) {
  const AnyError = ModernError.subclass('AnyError', opts)
  const ChildError = AnyError.subclass('ChildError')
  const ErrorSubclasses = [AnyError, ChildError]
  const ErrorClasses = [ModernError, ...ErrorSubclasses]
  return { ErrorClasses, ErrorSubclasses }
}
