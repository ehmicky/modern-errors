import { excludeKeys, includeKeys } from 'filter-obj'

import { deepClone } from '../utils/clone.js'

import { mergePluginsOpts, getPluginNames } from './merge.js'

// We keep track of un-normalized plugins options to re-use them later:
//  - When merging with parent `AnyError`
//  - Inside `error.*()` instance methods
// We use a `WeakMap` `errorData` to keep it internal.
//  - Even to plugin authors
//  - This also ensures this does not change how the error is printed
export const computePluginsOpts = function ({
  opts,
  cause,
  isAnyError,
  errorData,
  plugins,
}) {
  const pluginsOpts = includeKeys(opts, getPluginNames(plugins))
  const optsA = excludeKeys(opts, getPluginNames(plugins))

  const pluginsOptsA = wrapPluginsOpts({
    pluginsOpts,
    cause,
    isAnyError,
    errorData,
    plugins,
  })

  const pluginsOptsB = deepClone(pluginsOptsA)
  return { opts: optsA, pluginsOpts: pluginsOptsB }
}

// `AnyError` merges options instead of overriding them.
// This uses options before they are normalized, since this is how users who
// pass those options understand them.
const wrapPluginsOpts = function ({
  pluginsOpts,
  cause,
  isAnyError,
  errorData,
  plugins,
}) {
  return isAnyError
    ? mergePluginsOpts(errorData.get(cause).pluginsOpts, pluginsOpts, plugins)
    : pluginsOpts
}
