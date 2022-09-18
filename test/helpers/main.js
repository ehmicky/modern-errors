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

export const defineClassesOpts = function (ErrorClasses, globalOpts, plugins) {
  const AnyError = createAnyError(globalOpts, plugins)
  const ErrorClassesA = createErrorClasses(AnyError, ErrorClasses)
  return { AnyError, ...ErrorClassesA }
}

export const createAnyError = function (
  globalOpts = {},
  plugins = [TEST_PLUGIN],
) {
  return modernErrors(plugins, globalOpts)
}

export const createErrorClasses = function (
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
