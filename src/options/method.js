import { mergePluginsOpts } from './merge.js'

// We return `true` by default to enforce defining `plugin.isOptions()` to be
// able to use any `staticMethods|instanceMethods` with arguments.
// However, if there are no options (i.e. `plugin.getOptions()` is undefined),
// we return `false` since `isOptions()` is unnecessary then.
export const normalizeIsOptions = ({
  plugin,
  plugin: { getOptions, isOptions = () => getOptions !== undefined },
}) => ({ ...plugin, isOptions })

// Options can be passed as the last argument of `staticMethods|instanceMethods`
// `plugin.isOptions(lastArgument) => boolean` can be defined to distinguish
// that last options argument from other arguments for any of those methods.
// `plugin.isOptions()` should be as wide as possible:
//   - It should only distinguish `options` from methods actual last arguments
//   - While still ensuring invalid options are passed to `plugin.getOptions()`
//     instead of considering them not options
// `plugin.isOptions()` has the following pros:
//  - Users can pass `options[pluginName]` instead of `options`
//  - Plugin methods can have variadic and optional parameters
//  - It does not rely on brittle `Function.length`
// Instance method options have priority over error instance options:
//  - The instance method's caller is usually unaware of instance options,
//    making it surprising if some of the options passed to the method are not
//    taken into account due to being overridden
//  - Instance methods are more specific since they can be called multiple times
//    per error instance with different options
// Static method options also have priority over error instance options, for
// consistency with instance methods.
export const getMethodOpts = (args, plugin) => {
  if (args.length === 0) {
    return { args }
  }

  const lastArg = args.at(-1)
  return lastArgIsOptions(plugin, lastArg)
    ? { args: args.slice(0, -1), methodOpts: { [plugin.name]: lastArg } }
    : { args }
}

const lastArgIsOptions = ({ isOptions, fullName }, lastArg) => {
  const isOptionsResult = isOptions(lastArg)

  if (typeof isOptionsResult !== 'boolean') {
    throw new TypeError(
      `The plugin "${fullName}"'s "isOptions()" method must return a boolean, not: ${typeof isOptionsResult}`,
    )
  }

  return isOptionsResult
}

export const mergeMethodOpts = (pluginsOpts, methodOpts, plugins) =>
  methodOpts === undefined
    ? pluginsOpts
    : mergePluginsOpts(pluginsOpts, methodOpts, plugins)
