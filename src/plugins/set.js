import { getErrorOpts } from './normalize.js'

// Apply each `plugin.normalize()` then `plugin.set()`
export const applyPluginsSet = function ({
  error,
  BaseError,
  AnyError,
  KnownClasses,
  errorData,
  cause,
  plugins,
}) {
  plugins.forEach((plugin) => {
    applyPluginSet({
      error,
      BaseError,
      AnyError,
      KnownClasses,
      errorData,
      cause,
      plugin,
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
const applyPluginSet = function ({
  error,
  BaseError,
  AnyError,
  KnownClasses,
  errorData,
  cause,
  plugin,
}) {
  if (plugin.set === undefined) {
    return
  }

  if (cause instanceof BaseError) {
    const causeOpts = getErrorOpts(cause, errorData, plugin)
    plugin.unset.call(undefined, {
      error,
      options: causeOpts,
      AnyError,
      KnownClasses,
    })
  }

  const pluginOpts = getErrorOpts(error, errorData, plugin)
  plugin.set.call(undefined, {
    error,
    options: pluginOpts,
    AnyError,
    KnownClasses,
  })
}
