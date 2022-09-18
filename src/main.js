import { createAnyError } from './any/main.js'
import { getGlobalOpts } from './plugins/class_opts.js'
import { addAllInstanceMethods } from './plugins/instance.js'
import { addAllStaticMethods } from './plugins/static.js'
import { normalizePlugins } from './plugins/validate.js'

// Creates error classes.
export default function modernErrors(plugins, globalOpts) {
  const pluginsA = normalizePlugins(plugins)
  const globalOptsA = getGlobalOpts(pluginsA, globalOpts)
  const KnownClasses = {}
  const errorData = new WeakMap()
  const AnyError = createAnyError({
    KnownClasses,
    errorData,
    plugins: pluginsA,
    globalOpts: globalOptsA,
  })
  addAllInstanceMethods({
    plugins: pluginsA,
    KnownClasses,
    errorData,
    AnyError,
  })
  addAllStaticMethods({
    plugins: pluginsA,
    globalOpts: globalOptsA,
    KnownClasses,
    AnyError,
  })
  return AnyError
}
