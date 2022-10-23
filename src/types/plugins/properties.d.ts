import type { UnionToIntersection } from '../utils.js'
import type { Plugin, Plugins } from './main.js'
import type { Info } from './info.js'

type GetProperties = (info: Info['properties']) => {
  [PropName: string]: unknown
}

type PluginProperties<PluginArg extends Plugin> = PluginArg extends Plugin
  ? PluginArg['properties'] extends GetProperties
    ? ReturnType<PluginArg['properties']>
    : {}
  : {}

export type PluginsProperties<PluginsArg extends Plugins> = UnionToIntersection<
  PluginProperties<PluginsArg[number]>
>
