import { excludeKeys, includeKeys } from 'filter-obj'
import isPlainObj from 'is-plain-obj'

import { instancesData } from '../subclass/map.js'

import { deepClone } from './clone.js'
import { mergePluginsOpts, getPluginNames } from './merge.js'

// Split `nativeOpts` (native `Error` options like `cause`) and `pluginsOpts`
export const computePluginsOpts = function (ErrorClass, plugins, opts = {}) {
  validateOpts(ErrorClass, opts)
  const { errors, ...optsA } = opts
  const nativeOpts = excludeKeys(optsA, getPluginNames(plugins))
  const pluginsOpts = includeKeys(optsA, getPluginNames(plugins))
  const pluginsOptsA = wrapPluginsOpts(plugins, pluginsOpts, nativeOpts)
  return { nativeOpts, errors, pluginsOpts: pluginsOptsA }
}

// Unknown `Error` options are not validated, for compatibility with any
// potential JavaScript platform, since `error` has many non-standard elements.
//  - This also ensures compatibility with future JavaScript features or with
//    any `Error` polyfill
// We allow `undefined` message since it is allowed by the standard, internally
// normalized to an empty string
//  - However, we do not allow it to be optional, i.e. options are always the
//    second object, and empty strings must be used to ignore messages, since
//    this is:
//     - More standard
//     - More monomorphic
//     - Safer against injections
const validateOpts = function (ErrorClass, opts) {
  if (!isPlainObj(opts)) {
    throw new TypeError(
      `Error options must be a plain object or undefined: ${opts}`,
    )
  }

  if (opts.custom !== undefined) {
    throw new TypeError(
      `Error option "custom" must be passed to "${ErrorClass.name}.subclass()", not to error constructors.`,
    )
  }
}

// We keep track of un-normalized plugins options to re-use them later inside
// `error.*()` instance methods.
// We merge the options before they are normalized, since this is how users who
// pass those options understand them.
const wrapPluginsOpts = function (plugins, pluginsOpts, { cause }) {
  if (!instancesData.has(cause)) {
    return pluginsOpts
  }

  const causePluginsOpts = instancesData.get(cause).pluginsOpts

  if (causePluginsOpts === undefined) {
    return pluginsOpts
  }

  const pluginsOptsA = mergePluginsOpts(causePluginsOpts, pluginsOpts, plugins)
  return deepClone(pluginsOptsA)
}
