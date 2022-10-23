import type { Plugin } from '../plugins/shape.js'
import type { ExternalPluginOptions } from './plugins.js'

/**
 *
 */
export type MethodOptions<PluginArg extends Plugin> =
  ExternalPluginOptions<PluginArg>
