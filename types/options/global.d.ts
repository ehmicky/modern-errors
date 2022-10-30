import type { Plugins } from '../plugins/shape.js'
import type { PluginsOptions } from './plugins.js'

/**
 * Global options, used internally only with additional generics
 */
type SpecificGlobalOptions<PluginsArg extends Plugins> =
  PluginsOptions<PluginsArg>

/**
 * Global options passed to `modernErrors(plugins, options)`
 */
export type GlobalOptions<PluginsArg extends Plugins = []> =
  SpecificGlobalOptions<PluginsArg>
