import { mergePluginsOpts } from './merge.js'

// We return `true` by default to enforce defining `plugin.isOptions()` to be
// able to use any `static|instanceMethods` with arguments
export const defaultIsOptions = function () {
  return true
}

// Options can be passed as the last argument of `static|instanceMethods`.
// `plugin.isOptions(lastArgument) => boolean` can be defined to distinguish
// that last options argument from other arguments for any of those methods.
// `plugin.isOptions()` should be as wide as possible:
//   - It should only distinguish `option` from methods actual last arguments
//   - While still ensuring invalid options are passed to `plugin.normalize()`
//     instead of considering them not options
// `plugin.isOptions()` has the following props:
//  - Users can pass `options[pluginName]` instead of `options`
//  - Plugin methods can have variadic and optional parameters
//  - It does not rely on brittle `Function.length`
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
