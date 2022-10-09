import { finalizePluginsOpts } from './get.js'
import { mergeClassOpts } from './merge.js'

// Create `info.errorInfo(error)` which returns error-specific information:
// `options` and `unknownDeep`.
// This is meant to be used by plugins either:
//  - Operating on nested errors
//  - With static methods operating on errors
//     - E.g. when integrating with another library's plugin system, static
//       methods are needed to return that other plugin, but they need to take
//       errors as argument
export const getErrorInfo = function (
  { errorData, AnyError, ErrorClasses, methodOpts, plugins, plugin },
  error,
) {
  const errorA = AnyError.normalize(error)
  const { pluginsOpts, unknownDeep } = errorData.get(errorA)
  const pluginsOptsA = mergeClassOpts({
    error: errorA,
    ErrorClasses,
    plugins,
    pluginsOpts,
  })
  const options = finalizePluginsOpts({
    pluginsOpts: pluginsOptsA,
    methodOpts,
    plugins,
    plugin,
  })
  return { options, unknownDeep }
}
