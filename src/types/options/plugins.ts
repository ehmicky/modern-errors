import type { Plugins, Plugin } from '../plugins/main.js'
import type { ErrorProps } from '../core_plugins/props.js'

export type ExternalPluginOptions<PluginArg extends Plugin> =
  PluginArg['getOptions'] extends NonNullable<Plugin['getOptions']>
    ? Parameters<PluginArg['getOptions']>[0]
    : never

type LiteralString<T extends string> = string extends T ? never : T

type ExternalPluginsOptions<PluginsArg extends Plugins> = {
  readonly [PluginArg in PluginsArg[number] as LiteralString<
    PluginArg['name']
  >]?: ExternalPluginOptions<PluginArg>
}

export interface CorePluginsOptions {
  /**
   *
   */
  readonly props?: ErrorProps
}

export type PluginsOptions<PluginsArg extends Plugins> =
  keyof ExternalPluginsOptions<PluginsArg> extends never
    ? CorePluginsOptions
    : CorePluginsOptions & ExternalPluginsOptions<PluginsArg>

export type GetOptions = (input: never, full: boolean) => unknown

export type IsOptions = (input: unknown) => boolean
