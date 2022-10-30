import type { Plugins } from '../plugins/shape.js'
import type { ErrorConstructor } from './parent/main.js'
import type { Intersect } from '../utils.js'

export type CustomStaticAttributes<
  PluginsArg extends Plugins,
  ParentAnyErrorClass extends ErrorConstructor<PluginsArg>,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = Intersect<{}, ParentErrorClass, keyof ParentAnyErrorClass>
