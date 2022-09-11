import { mergePluginsOpts } from './merge.js'
import { normalizePluginOpts } from './normalize.js'

// `AnyError.*` can be defined to apply global options, i.e. to all classes.
// Those are validated right away, before merging to class options, since they
// are used on their own by static methods.
export const getGlobalOpts = function (
  { AnyError: globalOpts = {}, ...classesOpts },
  plugins,
) {
  plugins.forEach((plugin) => {
    normalizePluginOpts(globalOpts, plugin)
  })
  return { classesOpts, globalOpts }
}

// Validate and compute class options when `modernErrors()` is called so this
// throws at load time instead of at runtime.
// Merging priority is: global < class < instance options.
export const setClassOpts = function ({
  ErrorClass,
  globalOpts,
  classOpts,
  errorData,
  plugins,
}) {
  const classOptsA = mergePluginsOpts(globalOpts, classOpts, plugins)
  errorData.set(ErrorClass, { classOpts: classOptsA })
  plugins.forEach((plugin) => {
    normalizePluginOpts(classOptsA, plugin)
  })
}
