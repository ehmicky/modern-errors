import { mergeClassOpts } from '../../options/merge.js'
import { finalizePluginsOpts } from '../../options/plugins.js'
import { instancesData, classesData } from '../../subclass/map.js'

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
  if (!instancesData.has(error)) {
    throw new Error(
      '"info.errorInfo(error)" must be called after "error" has been passed to "ErrorClass.normalize(error)"',
    )
  }

  const ErrorClass = error.constructor
  const ErrorClasses = getSubclasses(ErrorClass)
  const { pluginsOpts } = instancesData.get(error)
  const pluginsOptsA = mergeClassOpts(ErrorClass, plugins, pluginsOpts)
  const options = finalizePluginsOpts({
    pluginsOpts: pluginsOptsA,
    methodOpts,
    plugins,
    plugin,
  })
  return { ErrorClass, ErrorClasses, options }
}

// `ErrorClasses` are passed to all plugin methods.
// It excludes parent classes.
// A shallow copy is done to prevent mutations.
// This is an array, not an object, since some error classes might have
// duplicate names.
export const getSubclasses = function (ErrorClass) {
  const { subclasses } = classesData.get(ErrorClass)
  return [...subclasses]
}
