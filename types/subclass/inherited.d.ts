import type { Plugins } from '../plugins/shape.js'
import type { ErrorConstructor } from './parent/main.js'
import type { Intersect } from '../utils.js'

/**
 * Static properties defined with the `custom` option
 */
export type CustomStaticAttributes<
  PluginsArg extends Plugins,
  ParentAnyErrorClass extends ErrorConstructor<PluginsArg>,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = Intersect<{}, ParentErrorClass, keyof ParentAnyErrorClass>
