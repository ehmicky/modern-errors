import type { Plugins } from '../plugins/shape.js'
import type { AggregateErrorsOption } from '../any/aggregate.js'
import type { PluginsOptions } from './plugins.js'

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
