import { createAnyError } from './any/main.js'
import { addAllInstanceMethods } from './plugins/instance/add.js'
import { normalizePlugins } from './plugins/shape/main.js'
import { addAllStaticMethods } from './plugins/static/add.js'

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
  addAllInstanceMethods({
    plugins: pluginsA,
    ErrorClasses,
    errorData,
    AnyError,
  })
  addAllStaticMethods({
    plugins: pluginsA,
    ErrorClasses,
    errorData,
    AnyError,
  })
  return AnyError
}
