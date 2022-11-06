import ModernError from 'modern-errors'

export { ModernError }

export const getClasses = function (opts) {
  const AnyError = ModernError.subclass('AnyError', opts)
  const ChildError = AnyError.subclass('ChildError')
  const ErrorSubclasses = [AnyError, ChildError]
  const ErrorClasses = [ModernError, ...ErrorSubclasses]
  return { ErrorClasses, ErrorSubclasses, ChildError }
}
