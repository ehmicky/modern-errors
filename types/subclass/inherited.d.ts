import type { Plugins } from '../plugins/shape.js'
import type { ErrorConstructor } from './parent/main.js'
import type { OmitKeys } from '../utils.js'

/**
 * Static properties defined with the `custom` option
 */
export type CustomStaticAttributes<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  ChildKeys extends PropertyKey,
> = OmitKeys<ParentErrorClass, ChildKeys>
