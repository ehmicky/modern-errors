import { mergePluginsOpts } from './merge.js'

export const normalizeIsOptions = function (plugin) {
  const isOptions = getIsOptions(plugin)
  return { ...plugin, isOptions }
}

// We return `true` by default to enforce defining `plugin.isOptions()` to be
// able to use any `static|instanceMethods` with arguments
// However, if there are no options (i.e. `plugin.normalize()` is undefined),
// we return `false` since `isOptions()` is unnecessary then.
const getIsOptions = function ({ isOptions, normalize }) {
  return isOptions === undefined ? () => normalize !== undefined : isOptions
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
export const mergeMethodOpts = function ({
  args,
  pluginsOpts,
  plugin,
  plugin: { name, isOptions },
  plugins,
}) {
  if (isOptions === undefined || args.length === 0) {
    return { args, pluginsOpts }
  }

  const lastArg = args[args.length - 1]

  if (!lastArgIsOptions(plugin, lastArg)) {
    return { args, pluginsOpts }
  }

  const pluginsOptsA = mergePluginsOpts(
    pluginsOpts,
    { [name]: lastArg },
    plugins,
  )
  return { args: args.slice(0, -1), pluginsOpts: pluginsOptsA }
}

const lastArgIsOptions = function ({ isOptions, fullName }, lastArg) {
  const isOptionsResult = isOptions({ options: lastArg })

  if (typeof isOptionsResult !== 'boolean') {
    throw new TypeError(
      `The plugin "${fullName}"'s "isOptions()" method must return a boolean, not: ${typeof isOptionsResult}`,
    )
  }

  return isOptionsResult
}
