import type { Plugin } from '../plugins/shape/main.js'
import type { ExternalPluginOptions } from './plugins.js'

/**
 * Options passed to plugin methods:
 * `ErrorClass.{staticMethod}(..., options)`,
 * `ErrorClass.{instanceMethod}(error, ..., options)` or
 * `error.{instanceMethod}(..., options)`
 */
export type MethodOptions<PluginArg extends Plugin> =
  ExternalPluginOptions<PluginArg>
