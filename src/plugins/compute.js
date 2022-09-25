import { deepClone } from './clone.js'
import { mergePluginsOpts } from './merge.js'

// We keep track of un-normalized plugins options to re-use them later:
//  - When merging with parent `AnyError`
//  - Inside `error.*()` instance methods
// We use a `WeakMap` `errorData` to keep it internal.
//  - Even to plugin authors
//  - This also ensures this does not change how the error is printed
export const computePluginsOpts = function ({
  error,
  opts,
  cause,
  isAnyError,
  ErrorClasses,
  errorData,
  plugins,
}) {
  const { classOpts } = ErrorClasses[error.name]
  const parentOpts = mergePluginsOpts(classOpts, opts, plugins)
  const pluginsOpts = wrapPluginsOpts({
    parentOpts,
    cause,
    isAnyError,
    errorData,
    plugins,
  })
  const pluginsOptsA = deepClone(pluginsOpts)
  errorData.set(error, { pluginsOpts: pluginsOptsA })
  return pluginsOptsA
}

// `AnyError` merges options instead of overriding them.
// This uses options before they are normalized, since this is how users who
// pass those options understand them.
const wrapPluginsOpts = function ({
  parentOpts,
  cause,
  isAnyError,
  errorData,
  plugins,
}) {
  if (!isAnyError) {
    return parentOpts
  }

  const { pluginsOpts } = errorData.get(cause)
  return mergePluginsOpts(pluginsOpts, parentOpts, plugins)
}
