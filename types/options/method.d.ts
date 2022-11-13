import type { Plugin } from '../plugins/shape.js'
import type { ExternalPluginOptions } from './plugins.js'

/**
 * Options passed to plugin methods: `error.{instanceMethod}(..., options)` or
 * `ErrorClass.{staticMethod}(..., options)`
 */
export type MethodOptions<PluginArg extends Plugin> =
  ExternalPluginOptions<PluginArg>
