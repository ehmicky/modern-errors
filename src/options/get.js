import { mergeSpecificCause } from '../merge/cause.js'

// `options` is `undefined` unless `plugin.getOptions()` is defined
//  - This encourages using `plugin.getOptions()`
export const normalizeGetOptions = ({
  plugin,
  plugin: {
    fullName,
    getOptions = defaultGetOptions.bind(undefined, fullName),
  },
}) => ({ ...plugin, getOptions })

const defaultGetOptions = (fullName, options) => {
  if (options !== undefined) {
    throw new Error(
      `The plugin "${fullName}" does not have any options: ${options}`,
    )
  }
}

// Call `plugin.getOptions()`
export const getPluginOpts = ({
  pluginsOpts,
  plugin: { name, getOptions },
  full,
}) => {
  try {
    return getOptions(pluginsOpts[name], full)
  } catch (cause) {
    throw mergeSpecificCause(new Error(`Invalid "${name}" options:`), cause)
  }
}
