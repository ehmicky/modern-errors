import { finalizePluginsOpts } from './get.js'
import { mergeClassOpts } from './merge.js'

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
  const pluginsOptsB = finalizePluginsOpts({
    pluginsOpts: pluginsOptsA,
    methodOpts,
    plugins,
    plugin,
  })
  return { pluginsOpts: pluginsOptsB, unknownDeep }
}
