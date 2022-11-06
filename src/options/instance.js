import { excludeKeys, includeKeys } from 'filter-obj'

import { deepClone } from '../utils/clone.js'

import { mergePluginsOpts, getPluginNames } from './merge.js'

// We keep track of un-normalized plugins options to re-use them later inside
// `error.*()` instance methods.
// We use a `WeakMap` `errorData` to keep it internal.
//  - Even to plugin authors
//  - This also ensures this does not change how the error is printed
// We merge the options before they are normalized, since this is how users who
// pass those options understand them.
export const computePluginsOpts = function (opts, errorData, plugins) {
  const optsA = excludeKeys(opts, getPluginNames(plugins))
  const pluginsOpts = includeKeys(opts, getPluginNames(plugins))
  const pluginsOptsA = wrapPluginsOpts({
    pluginsOpts,
    opts: optsA,
    errorData,
    plugins,
  })
  return { opts: optsA, pluginsOpts: pluginsOptsA }
}

const wrapPluginsOpts = function ({
  pluginsOpts,
  opts: { cause },
  errorData,
  plugins,
}) {
  const causePluginsOpts = errorData.get(cause).pluginsOpts

  if (causePluginsOpts === undefined) {
    return pluginsOpts
  }

  const pluginsOptsA = mergePluginsOpts(causePluginsOpts, pluginsOpts, plugins)
  return deepClone(pluginsOptsA)
}
