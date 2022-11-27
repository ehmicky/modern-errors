import type { UnionToIntersection } from '../../utils/main.js'
import type { InfoParameter } from '../info/main.js'
import type { Plugin, Plugins } from '../shape/main.js'

/**
 * Unbound added properties of a plugin
 */
interface AddedProperties {
  [PropName: string]: unknown
}

/**
 * Bound added properties of a plugin, always defined
 */
type GetProperties = (info: InfoParameter['properties']) => AddedProperties

/**
 * Bound added properties of a plugin, if defined
 */
type PluginProperties<PluginArg extends Plugin> = PluginArg extends Plugin
  ? PluginArg extends { properties: GetProperties }
    ? ReturnType<PluginArg['properties']>
    : {}
  : {}

/**
 * Bound added properties of all plugins
 */
export type PluginsProperties<PluginsArg extends Plugins> = UnionToIntersection<
  PluginProperties<PluginsArg[number]>
> & {}
