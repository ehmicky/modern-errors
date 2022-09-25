import { deepClone } from './clone.js'
import { normalizePluginOpts } from './get.js'

// Retrieve `info` passed to all `plugin.*`
export const getPluginInfo = function ({
  pluginsOpts,
  plugin,
  AnyError,
  ErrorClasses,
}) {
  const pluginsOptsA = deepClone(pluginsOpts)
  const options = normalizePluginOpts(pluginsOptsA, plugin, true)
  const ErrorClassesA = getErrorClasses(ErrorClasses)
  return { options, AnyError, ErrorClasses: ErrorClassesA }
}

// `ErrorClasses` are passed to all plugin methods.
// A shallow copy is done to prevent mutations.
const getErrorClasses = function (ErrorClasses) {
  return Object.fromEntries(Object.entries(ErrorClasses).map(getErrorClass))
}

const getErrorClass = function ([className, { ErrorClass }]) {
  return [className, ErrorClass]
}
