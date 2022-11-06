import { mergeClassOpts } from '../../options/merge.js'
import { finalizePluginsOpts } from '../../options/plugins.js'
import { ERROR_INSTANCES } from '../../subclass/map.js'

// Create `info.errorInfo(error)` which returns error-specific information:
// `ErrorClass` and `options`.
// This is meant to be used by plugins either:
//  - Operating on nested errors
//  - With static methods operating on errors
//     - E.g. when integrating with another library's plugin system, static
//       methods are needed to return that other plugin, but they need to take
//       errors as argument
// If the `error` is not a `modern-errors` instance, an empty object is returned
//  - I.e. the plugin should call `ErrorClass.normalize(error[, UnknownError])`
//    first
export const getErrorInfo = function ({ methodOpts, plugins, plugin }, error) {
  if (!ERROR_INSTANCES.has(error)) {
    return {}
  }

  const ErrorClass = error.constructor
  const { pluginsOpts } = ERROR_INSTANCES.get(error)
  const pluginsOptsA = mergeClassOpts(ErrorClass, plugins, pluginsOpts)
  const options = finalizePluginsOpts({
    pluginsOpts: pluginsOptsA,
    methodOpts,
    plugins,
    plugin,
  })
  return { ErrorClass, options }
}
