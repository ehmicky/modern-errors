import { finalizePluginsOpts } from './get.js'
import { mergeClassOpts } from './merge.js'

// Create `info.errorInfo(error)` which returns error-specific information:
// `options` and `unknownDeep`.
// This is meant to be used by plugins.
export const createErrorInfo = function ({
  errorData,
  ErrorClasses,
  plugins,
  plugin,
  methodOpts,
}) {
  return getErrorInfo.bind(undefined, {
    errorData,
    ErrorClasses,
    plugins,
    plugin,
    methodOpts,
  })
}

const getErrorInfo = function (
  { errorData, ErrorClasses, plugins, plugin, methodOpts },
  error,
) {
  const { pluginsOpts, unknownDeep } = errorData.get(error)
  const pluginsOptsA = mergeClassOpts({
    error,
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
