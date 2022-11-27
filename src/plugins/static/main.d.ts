import type { InfoParameter } from '../info/main.js'

/**
 * Unbound static method of a plugin
 */
export type StaticMethod = (
  info: InfoParameter['staticMethods'],
  ...args: readonly never[]
) => unknown

/**
 * Unbound static methods of a plugin
 */
export interface StaticMethods {
  readonly [MethodName: string]: StaticMethod
}
