import type { Plugins } from '../plugins/main.js'
import type { AggregateErrorsOption } from '../aggregate.js'
import type { PluginsOptions } from './main.js'

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
