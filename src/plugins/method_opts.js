import { mergePluginsOpts } from './merge.js'

// We return `true` by default to enforce defining `plugin.isOptions()` to be
// able to use any `static|instanceMethods` with arguments
export const defaultIsOptions = function () {
  return true
}

export const applyIsOptions = function ({
  args,
  pluginsOpts,
  plugin: { name, isOptions },
  plugins,
}) {
  if (isOptions === undefined || args.length === 0) {
    return { args, pluginsOpts }
  }

  const lastArg = args[args.length - 1]

  if (!isOptions(lastArg)) {
    return { args, pluginsOpts }
  }

  const methodOpts = { [name]: lastArg }
  const pluginsOptsA = mergePluginsOpts(pluginsOpts, methodOpts, plugins)
  return { args: args.slice(0, -1), pluginsOpts: pluginsOptsA }
}
