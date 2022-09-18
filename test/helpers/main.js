import modernErrors from 'modern-errors'

import { TEST_PLUGIN } from './plugin.js'

export const defineCustomClass = function (custom, plugins) {
  return defineClassOpts({ custom }, plugins)
}

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

export const defineShallowCustom = function (globalOpts, plugins) {
  return defineClassesOpts(
    (AnyError) => ({ ShallowError: { custom: AnyError } }),
    globalOpts,
    plugins,
  )
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
  return defineClassesOpts(
    (AnyError) => {
      class ParentError extends AnyError {
        prop = true
        static staticProp = true
      }
      return {
        DeepCustomError: {
          custom: class DeepCustomError extends ParentError {},
        },
      }
    },
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
  const UnknownError = AnyError.create('UnknownError', unknownErrorOpts)
  const ErrorClassesA = Object.fromEntries(
    Object.entries(ErrorClasses).map(([errorName, classOpts]) => [
      errorName,
      AnyError.create(errorName, classOpts),
    ]),
  )
  return { UnknownError, ...ErrorClassesA }
}
