import type { Plugin } from '../plugins/main.js'
import type { ExternalPluginOptions } from './plugins.js'

/**
 *
 */
export type MethodOptions<PluginArg extends Plugin> =
  ExternalPluginOptions<PluginArg>
