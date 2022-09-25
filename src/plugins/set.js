import { deepClone } from './clone.js'
import { getErrorClasses } from './error_classes.js'
import { mergeClassOpts } from './merge.js'
import { normalizePluginOpts } from './normalize.js'

// Apply each `plugin.normalize()` then `plugin.set()`
export const applyPluginsSet = function ({
  error,
  AnyError,
  ErrorClasses,
  errorData,
  cause,
  plugins,
}) {
  plugins.forEach((plugin) => {
    applyPluginUnset({
      error,
      AnyError,
      ErrorClasses,
      errorData,
      cause,
      plugin,
      plugins,
    })
    applyPluginSet({
      error,
      AnyError,
      ErrorClasses,
      errorData,
      plugin,
      plugins,
    })
  })
}

// When an error is wrapped, the parent error overrides the child error's
// options.
//  - We do this by calling `plugin.unset()`, which should reverse
//    `plugin.set()`
// Calling all plugins `plugin.set()`, even if their options is not specified,
// also ensures they get refreshed
//  - E.g. the `bugs` plugin bumps the bugs URL to the bottom of `error.message`
// `AnyError` does it as well, but first merges the child's options with its
// own options.
// Why the outer error overrides inner's options:
//  - This is consistent with class merging, where the outer class has priority
//    by default
//  - This is consistent with the usual pattern where the last operation has
//    merging priority (e.g. `Object.assign()`, etc.)
//  - Options are often specific to a class
//     - Even when set as an instance options
//        - Also, distinguishing class from instance options is hard since
//          custom constructors might pass either to `super()`
//     - Mixing different errors' options could set options to classes where
//       they do not belong
//     - Users can use manual logic to reuse the inner's error properties,
//       after applying `AnyError.normalize()`
// This also keeps options merging with inner error separate and orthogonal
// from merging its class, message and stack.
const applyPluginUnset = function ({
  error,
  AnyError,
  ErrorClasses,
  errorData,
  cause,
  plugin,
  plugin: { unset },
  plugins,
}) {
  if (unset === undefined || !(cause instanceof AnyError)) {
    return
  }

  const info = getInfo({
    target: cause,
    error,
    AnyError,
    ErrorClasses,
    errorData,
    plugin,
    plugins,
  })
  unset(info)
}

const applyPluginSet = function ({
  error,
  AnyError,
  ErrorClasses,
  errorData,
  plugin,
  plugin: { set },
  plugins,
}) {
  if (set === undefined) {
    return
  }

  const info = getInfo({
    target: error,
    error,
    AnyError,
    ErrorClasses,
    errorData,
    plugin,
    plugins,
  })
  set(info)
}

const getInfo = function ({
  target,
  error,
  AnyError,
  ErrorClasses,
  errorData,
  plugin,
  plugins,
}) {
  const { pluginsOpts } = errorData.get(target)
  const pluginsOptsA = mergeClassOpts({
    pluginsOpts,
    error,
    ErrorClasses,
    plugins,
  })
  const pluginsOptsB = deepClone(pluginsOptsA)
  const options = normalizePluginOpts(pluginsOptsB, plugin, true)
  const ErrorClassesA = getErrorClasses(ErrorClasses)
  return { options, error, AnyError, ErrorClasses: ErrorClassesA }
}
