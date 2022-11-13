import type { ErrorConstructor } from './parent/main.js'
import type { OmitKeys } from '../utils.js'

/**
 * Static properties defined with the `custom` option
 */
export type CustomStaticAttributes<
  ParentErrorClass extends ErrorConstructor,
  ChildKeys extends PropertyKey,
> = OmitKeys<ParentErrorClass, ChildKeys>
