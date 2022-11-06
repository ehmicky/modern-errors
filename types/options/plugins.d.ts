import type { Plugins, Plugin } from '../plugins/shape.js'
import type { ErrorProps } from '../core_plugins/props/main.js'

/**
 * Options of a plugin
 */
export type ExternalPluginOptions<PluginArg extends Plugin> =
  PluginArg extends Plugin
    ? PluginArg['getOptions'] extends NonNullable<Plugin['getOptions']>
      ? Parameters<PluginArg['getOptions']>[0]
      : never
    : never

/**
 * Exclude plugins with a `name` that is not typed `as const`
 */
type PluginOptionName<PluginArg extends Plugin> =
  string extends PluginArg['name']
    ? never
    : ExternalPluginOptions<PluginArg> extends never
    ? never
    : PluginArg['name']

/**
 * Options of all non-core plugins
 */
type ExternalPluginsOptions<PluginsArg extends Plugins> = {
  readonly [PluginArg in PluginsArg[number] as PluginOptionName<PluginArg>]?: ExternalPluginOptions<PluginArg>
}

/**
 * Options of all core plugins
 */
export interface CorePluginsOptions {
  /**
   * Error properties.
   *
   * @example
   * ```js
   * const error = new InputError('...', { props: { isUserError: true } })
   * console.log(error.isUserError) // true
   * ```
   *
   * @example
   * ```js
   * const InputError = BaseError.subclass('InputError', {
   *   props: { isUserError: true },
   * })
   * const error = new InputError('...')
   * console.log(error.isUserError) // true
   * ```
   */
  readonly props?: ErrorProps
}

/**
 * Options of all plugins, including core plugins
 */
export type PluginsOptions<PluginsArg extends Plugins> =
  keyof ExternalPluginsOptions<PluginsArg> extends never
    ? CorePluginsOptions
    : CorePluginsOptions & ExternalPluginsOptions<PluginsArg>
