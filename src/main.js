import { createAnyError } from './any/main.js'
import { normalizePlugins } from './plugins/shape/main.js'

// Creates error classes.
export default function modernErrors(plugins, globalOpts) {
  const ErrorClasses = {}
  const errorData = new WeakMap()
  const pluginsA = normalizePlugins(plugins)
  const AnyError = createAnyError({
    ErrorClasses,
    errorData,
    plugins: pluginsA,
    globalOpts,
  })
  return AnyError
}
