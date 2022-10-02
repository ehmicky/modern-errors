import { createAnyError } from './any/main.js'
import { getGlobalOpts } from './plugins/class_opts.js'
import { addAllInstanceMethods } from './plugins/instance.js'
import { addAllStaticMethods } from './plugins/static.js'
import { normalizePlugins } from './plugins/validate.js'
import { addSubclass } from './subclass/main.js'

// Creates error classes.
export default function modernErrors(plugins, globalOpts) {
  const ErrorClasses = {}
  const errorData = new WeakMap()
  const pluginsA = normalizePlugins(plugins)
  const AnyError = createAnyError(ErrorClasses, errorData, pluginsA)
  const globalOptsA = getGlobalOpts(pluginsA, AnyError, globalOpts)
  addSubclass({
    AnyError,
    globalOpts: globalOptsA,
    ErrorClasses,
    plugins: pluginsA,
  })
  addAllInstanceMethods({
    plugins: pluginsA,
    ErrorClasses,
    errorData,
    AnyError,
  })
  addAllStaticMethods({
    plugins: pluginsA,
    globalOpts: globalOptsA,
    ErrorClasses,
    AnyError,
  })
  return AnyError
}
