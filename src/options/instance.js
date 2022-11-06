import { excludeKeys, includeKeys } from 'filter-obj'

import { ERROR_INSTANCES } from '../subclass/map.js'
import { deepClone } from '../utils/clone.js'

import { mergePluginsOpts, getPluginNames } from './merge.js'

// We keep track of un-normalized plugins options to re-use them later inside
// `error.*()` instance methods.
// We merge the options before they are normalized, since this is how users who
// pass those options understand them.
export const computePluginsOpts = function (plugins, opts) {
  const optsA = excludeKeys(opts, getPluginNames(plugins))
  const pluginsOpts = includeKeys(opts, getPluginNames(plugins))
  const pluginsOptsA = wrapPluginsOpts(plugins, pluginsOpts, optsA)
  return { opts: optsA, pluginsOpts: pluginsOptsA }
}

const wrapPluginsOpts = function (plugins, pluginsOpts, { cause }) {
  if (!ERROR_INSTANCES.has(cause)) {
    return pluginsOpts
  }

  const causePluginsOpts = ERROR_INSTANCES.get(cause).pluginsOpts

  if (causePluginsOpts === undefined) {
    return pluginsOpts
  }

  const pluginsOptsA = mergePluginsOpts(causePluginsOpts, pluginsOpts, plugins)
  return deepClone(pluginsOptsA)
}
