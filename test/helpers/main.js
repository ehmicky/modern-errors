import ModernError from 'modern-errors'

export { ModernError }

export const getClasses = function (opts) {
  const BaseError = ModernError.subclass('BaseError', opts)
  const ChildError = BaseError.subclass('ChildError')
  const ErrorSubclassesArg = [BaseError, ChildError]
  const ErrorClassesArg = [ModernError, ...ErrorSubclassesArg]
  return { ErrorClasses: ErrorClassesArg, ErrorSubclasses: ErrorSubclassesArg }
}

export const { ErrorClasses, ErrorSubclasses } = getClasses()
