import modernErrors from 'modern-errors'

import { TEST_PLUGIN } from './plugin.js'

export const defineGlobalOpts = function (globalOpts, plugins) {
  return defineClassOpts({}, globalOpts, plugins)
}

export const defineClassOpts = function (classOpts, globalOpts, plugins) {
  return defineClassesOpts({ TestError: classOpts }, globalOpts, plugins)
}

export const defineDeepCustom = function (childOpts, parentOpts, ...args) {
  const { AnyError, UnknownError, SimpleCustomError } = defineSimpleCustom(
    parentOpts,
    ...args,
  )
  const TestError = SimpleCustomError.subclass('TestError', childOpts)
  return { AnyError, UnknownError, SimpleCustomError, TestError }
}

export const defineSimpleCustom = function (classOpts, globalOpts, plugins) {
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
    globalOpts,
    plugins,
  )
}

export const defineClassesOpts = function (ErrorClasses, globalOpts, plugins) {
  const AnyError = createAnyError(globalOpts, plugins)
  const ErrorClassesA =
    typeof ErrorClasses === 'function' ? ErrorClasses(AnyError) : ErrorClasses
  const ErrorClassesB = createErrorClasses(AnyError, ErrorClassesA)
  return { AnyError, ...ErrorClassesB }
}

export const createAnyError = function (
  globalOpts = {},
  plugins = [TEST_PLUGIN],
) {
  return modernErrors(plugins, globalOpts)
}

const createErrorClasses = function (
  AnyError,
  { UnknownError: unknownErrorOpts = {}, ...ErrorClasses },
) {
  const UnknownError = AnyError.subclass('UnknownError', unknownErrorOpts)
  const ErrorClassesA = Object.fromEntries(
    Object.entries(ErrorClasses).map(([errorName, classOpts]) => [
      errorName,
      AnyError.subclass(errorName, classOpts),
    ]),
  )
  return { UnknownError, ...ErrorClassesA }
}
