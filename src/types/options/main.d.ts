import type { Plugins, Plugin } from '../plugins/main.js'
import type { AggregateErrorsOption } from '../aggregate.js'
import type { ErrorProps } from '../props.js'

type LiteralString<T extends string> = string extends T ? never : T

type ExternalPluginOptions<PluginArg extends Plugin> =
  PluginArg['getOptions'] extends NonNullable<Plugin['getOptions']>
    ? Parameters<PluginArg['getOptions']>[0]
    : never

type ExternalPluginsOptions<PluginsArg extends Plugins> = {
  readonly [PluginArg in PluginsArg[number] as LiteralString<
    PluginArg['name']
  >]?: ExternalPluginOptions<PluginArg>
}

/**
 *
 */
export type MethodOptions<PluginArg extends Plugin> =
  ExternalPluginOptions<PluginArg>

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

interface MainInstanceOptions {
  /**
   *
   */
  readonly cause?: unknown

  /**
   *
   */
  readonly errors?: AggregateErrorsOption
}

export type SpecificInstanceOptions<PluginsArg extends Plugins> =
  MainInstanceOptions & PluginsOptions<PluginsArg>

/**
 *
 */
export type InstanceOptions<PluginsArg extends Plugins = []> =
  SpecificInstanceOptions<PluginsArg>
