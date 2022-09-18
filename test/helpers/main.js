import modernErrors from 'modern-errors'

import { TEST_PLUGIN } from './plugin.js'

export const defineGlobalOpts = function (globalOpts, plugins) {
  return defineClassesOpts({ InputError: {} }, globalOpts, plugins)
}

export const defineClassOpts = function (classOpts, plugins) {
  return defineClassesOpts({ InputError: classOpts }, {}, plugins)
}

export const defineSimpleClass = function (plugins) {
  return defineClassesOpts({ TestError: {} }, {}, plugins)
}

export const definePlugins = function (plugins) {
  return defineClassesOpts({}, {}, plugins)
}

export const defineSimpleCustom = function (globalOpts, plugins) {
  return defineClassesOpts(
    (AnyError) => ({
      SimpleCustomError: {
        custom: class SimpleCustomError extends AnyError {
          prop = true
          static staticProp = true
        },
      },
    }),
    globalOpts,
    plugins,
  )
}

export const defineDeepCustom = function (globalOpts, plugins) {
  const AnyError = createAnyError(globalOpts, plugins)
  const UnknownError = AnyError.class('UnknownError')
  const ParentError = AnyError.class('ParentError', {
    custom: class ParentError extends AnyError {
      prop = true
      static staticProp = true
    },
  })
  const DeepCustomError = ParentError.class('DeepCustomError', {
    custom: class DeepCustomError extends ParentError {},
  })
  return { AnyError, UnknownError, ParentError, DeepCustomError }
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
  const UnknownError = AnyError.class('UnknownError', unknownErrorOpts)
  const ErrorClassesA = Object.fromEntries(
    Object.entries(ErrorClasses).map(([errorName, classOpts]) => [
      errorName,
      AnyError.class(errorName, classOpts),
    ]),
  )
  return { UnknownError, ...ErrorClassesA }
}
