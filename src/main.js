import { createAnyError } from './any/main.js'
import { normalizePlugins } from './plugins/shape/main.js'

// Creates error classes.
export default function modernErrors(plugins, globalOpts) {
  const errorData = new WeakMap()
  const pluginsA = normalizePlugins(plugins)
  const AnyError = createAnyError(errorData, pluginsA, globalOpts)
  return AnyError
}
