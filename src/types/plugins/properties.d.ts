import type { UnionToIntersection } from '../utils.js'
import type { Plugin, Plugins } from './shape.js'
import type { Info } from './info.js'

interface AddedProperties {
  [PropName: string]: unknown
}

type GetProperties = (info: Info['properties']) => AddedProperties

type PluginProperties<PluginArg extends Plugin> = PluginArg extends Plugin
  ? PluginArg['properties'] extends GetProperties
    ? ReturnType<PluginArg['properties']>
    : {}
  : {}

export type PluginsProperties<PluginsArg extends Plugins> = UnionToIntersection<
  PluginProperties<PluginsArg[number]>
>
