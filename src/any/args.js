import { excludeKeys } from 'filter-obj'

import { deepClone } from '../plugins/clone.js'
import { excludePluginsOpts } from '../plugins/merge.js'

// Set `error.constructorArgs` so plugins like `modern-errors-serialize` can
// clone or serialize the error.
// This is non-enumerable and not documented.
export const setConstructorArgs = function ({
  error,
  opts,
  pluginsOpts,
  plugins,
  args,
}) {
  const optsA = getOpts(opts, pluginsOpts, plugins)
  const constructorArgs = [error.message, optsA, ...args.map(deepClone)]
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(error, 'constructorArgs', {
    value: constructorArgs,
    enumerable: false,
    writable: true,
    configurable: true,
  })
}

const getOpts = function (opts, pluginsOpts, plugins) {
  const optsA = excludePluginsOpts(opts, plugins)
  const optsB = excludeKeys(optsA, OMITTED_PROPS)
  return { ...optsB, ...pluginsOpts }
}

// `error.cause|errors` are big in serialized output and already set as
// static properties or merged, so we skip them
const OMITTED_PROPS = ['cause', 'errors']
