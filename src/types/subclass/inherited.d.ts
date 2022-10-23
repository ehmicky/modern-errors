import type { Plugins } from '../plugins/main.js'
import type { ErrorConstructor } from './parent.js'
import type { Intersect } from '../utils.js'

export type CustomStaticAttributes<
  PluginsArg extends Plugins,
  ParentAnyErrorClass extends ErrorConstructor<PluginsArg>,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = Intersect<{}, ParentErrorClass, keyof ParentAnyErrorClass>
