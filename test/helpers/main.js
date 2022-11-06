import { runInNewContext } from 'node:vm'

import ModernError from 'modern-errors'

export { ModernError }

export const getClasses = function (opts) {
  const AnyError = ModernError.subclass('AnyError', opts)
  const ChildError = AnyError.subclass('ChildError')
  const SpecificErrorClasses = [AnyError, ChildError]
  const KnownErrorClasses = [ModernError, ...SpecificErrorClasses]
  return { KnownErrorClasses, SpecificErrorClasses, AnyError, ChildError }
}

export const getUnknownErrors = function () {
  return [...getUnknownErrorInstances(), () => 'message', () => {}]
}

export const getUnknownErrorInstances = function () {
  return [TypeError, Error, runInNewContext('Error')].map(
    (ErrorClass) => () => new ErrorClass('message'),
  )
}
