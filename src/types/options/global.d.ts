import type { Plugins } from '../plugins/main.js'
import type { PluginsOptions } from './main.js'

type SpecificGlobalOptions<PluginsArg extends Plugins> =
  PluginsOptions<PluginsArg>

/**
 *
 */
export type GlobalOptions<PluginsArg extends Plugins = []> =
  SpecificGlobalOptions<PluginsArg>
