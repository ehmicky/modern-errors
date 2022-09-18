import modernErrors from 'modern-errors'

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
  const { UnknownError: unknownErrorOpts = {}, ...ErrorClassesA } =
    typeof ErrorClasses === 'function' ? ErrorClasses(AnyError) : ErrorClasses
  const UnknownError = AnyError.create('UnknownError', unknownErrorOpts)
  const ErrorClassesB = Object.fromEntries(
    Object.entries(ErrorClassesA).map(([errorName, classOpts]) => [
      errorName,
      AnyError.create(errorName, classOpts),
    ]),
  )
  return { AnyError, UnknownError, ...ErrorClassesB }
}

export const createAnyError = function (
  globalOpts = {},
  plugins = [TEST_PLUGIN],
) {
  return modernErrors(plugins, globalOpts)
}

export const TEST_PLUGIN = {
  name: 'prop',
  normalize({ options: prop }) {
    if (prop === 'invalid') {
      throw new TypeError('Invalid prop')
    }

    // eslint-disable-next-line fp/no-this
    return { prop, context: this }
  },
  unset(utils) {
    const { error } = utils
    // eslint-disable-next-line fp/no-this
    error.unset = { ...utils, context: this }
  },
  set(utils) {
    const { error } = utils
    // eslint-disable-next-line fp/no-this
    error.set = { ...utils, context: this }
  },
  instanceMethods: {
    getInstance(utils, ...args) {
      // eslint-disable-next-line fp/no-this
      return { ...utils, args, context: this }
    },
  },
  staticMethods: {
    getProp(utils, ...args) {
      // eslint-disable-next-line fp/no-this
      return { ...utils, args, context: this }
    },
  },
}
