import { excludeKeys } from 'filter-obj'

import { deepClone } from '../utils/clone.js'
import { setNonEnumProp } from '../utils/descriptors.js'

// Set `error.constructorArgs` so plugins like `modern-errors-serialize` can
// clone or serialize the error.
// This is non-enumerable and not documented.
export const setConstructorArgs = function ({
  error,
  opts,
  pluginsOpts,
  args,
}) {
  const optsA = excludeKeys(opts, OMITTED_PROPS)
  const optsB = { ...optsA, ...pluginsOpts }
  const argsA = args.map(deepClone)
  setNonEnumProp(error, 'constructorArgs', [error.message, optsB, ...argsA])
}

// `error.cause|errors` are big in serialized output and already set as
// static properties or merged, so we skip them
const OMITTED_PROPS = ['cause', 'errors']
