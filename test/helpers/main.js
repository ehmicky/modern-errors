import modernErrors from 'modern-errors'

import { TEST_PLUGIN } from './plugin.js'

export const defineDeepCustom = function (childOpts, parentOpts, opts) {
  const { AnyError, SimpleCustomError } = defineSimpleCustom(parentOpts, opts)
  const TestError = SimpleCustomError.subclass('TestError', childOpts)
  return { AnyError, SimpleCustomError, TestError }
}

export const defineSimpleCustom = function (classOpts, opts) {
  return defineClassesOpts(
    (AnyError) => ({
      SimpleCustomError: {
        custom: class SimpleCustomError extends AnyError {
          prop = true
          static staticProp = true
        },
        ...classOpts,
      },
    }),
    opts,
  )
}

export const defineClassesOpts = function (ErrorClasses, opts) {
  const AnyError = createAnyError(opts)
  const ErrorClassesA = createErrorClasses(AnyError, ErrorClasses)
  return { AnyError, ...ErrorClassesA }
}

const createAnyError = function ({ plugins = [TEST_PLUGIN], ...opts } = {}) {
  return modernErrors.subclass('AnyError', { ...opts, plugins })
}

const createErrorClasses = function (AnyError, ErrorClasses) {
  const ErrorClassesA =
    typeof ErrorClasses === 'function' ? ErrorClasses(AnyError) : ErrorClasses
  return Object.fromEntries(
    Object.entries(ErrorClassesA).map(([errorName, classOpts]) => [
      errorName,
      AnyError.subclass(errorName, classOpts),
    ]),
  )
}
