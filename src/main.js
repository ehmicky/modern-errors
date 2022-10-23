import { createAnyError } from './any/main.js'
import { getGlobalOpts } from './options/global.js'
import { addAllInstanceMethods } from './plugins/instance/add.js'
import { addAllStaticMethods } from './plugins/static/add.js'
import { normalizePlugins } from './plugins/validate/main.js'

// Creates error classes.
export default function modernErrors(plugins, globalOpts) {
  const ErrorClasses = {}
  const errorData = new WeakMap()
  const pluginsA = normalizePlugins(plugins)
  const globalOptsA = getGlobalOpts(pluginsA, globalOpts)
  const AnyError = createAnyError({
    ErrorClasses,
    errorData,
    plugins: pluginsA,
    globalOpts: globalOptsA,
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
    errorData,
    AnyError,
  })
  return AnyError
}
