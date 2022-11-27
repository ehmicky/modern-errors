import type { InfoParameter } from '../info/main.js'

/**
 * Unbound instance method of a plugin
 */
export type InstanceMethod = (
  info: InfoParameter['instanceMethods'],
  ...args: readonly never[]
) => unknown

/**
 * Unbound instance methods of a plugin
 */
export interface InstanceMethods {
  readonly [MethodName: string]: InstanceMethod
}
