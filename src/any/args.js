import { excludeKeys } from 'filter-obj'

import { deepClone } from '../plugins/clone.js'

// Set `error.constructorArgs` so plugins like `modern-errors-serialize` can
// clone or serialize the error.
// This is non-enumerable and not documented.
export const setConstructorArgs = function ({
  error,
  opts,
  pluginsOpts,
  args,
}) {
  const optsA = getOpts(opts, pluginsOpts)
  const constructorArgs = [error.message, optsA, ...args.map(deepClone)]
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
