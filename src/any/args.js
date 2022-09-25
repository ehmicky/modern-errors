import { excludeKeys } from 'filter-obj'
import isPlainObj from 'is-plain-obj'

import { deepClone } from '../plugins/clone.js'

// Set `error.constructorArgs` so plugins like `modern-errors-serialize` can
// clone or serialize the error.
// This is non-enumerable and not documented.
export const setConstructorArgs = function ({
  error,
  opts,
  cause,
  isAnyError,
  pluginsOpts,
  args,
}) {
  const optsA = getOpts(opts, pluginsOpts)
  const { opts: optsB, args: argsA } = mergeConstructorArgs({
    opts: optsA,
    args,
    cause,
    isAnyError,
  })
  const constructorArgs = [error.message, optsB, ...argsA.map(deepClone)]
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(error, 'constructorArgs', {
    value: constructorArgs,
    enumerable: false,
    writable: true,
    configurable: true,
  })
}

const getOpts = function (opts, pluginsOpts) {
  const optsA = excludeKeys(opts, OMITTED_PROPS)
  return { ...optsA, ...pluginsOpts }
}

// `error.cause|errors` are big in serialized output and already set as
// static properties or merged, so we skip them
const OMITTED_PROPS = ['cause', 'errors']

const mergeConstructorArgs = function ({ opts, args, cause, isAnyError }) {
  return isAnyError &&
    Array.isArray(cause.constructorArgs) &&
    isPlainObj(cause.constructorArgs[1])
    ? {
        opts: { ...cause.constructorArgs[1], ...opts },
        args: cause.constructorArgs.slice(2),
      }
    : { opts, args }
}
