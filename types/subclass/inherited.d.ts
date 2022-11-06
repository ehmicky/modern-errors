import type { Plugins } from '../plugins/shape.js'
import type { ErrorConstructor } from './parent/main.js'
import type { OmitKeys } from '../utils.js'

/**
 * Static properties defined with the `custom` option
 */
export type CustomStaticAttributes<
  PluginsArg extends Plugins,
  ParentBaseErrorClass extends ErrorConstructor<PluginsArg>,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = OmitKeys<ParentErrorClass, keyof ParentBaseErrorClass>
