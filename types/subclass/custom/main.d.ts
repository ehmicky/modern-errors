import type { InstanceOptions } from '../../options/instance.js'

/**
 * `custom` option
 */
export type CustomClass = {
  new (message: string, options?: InstanceOptions): Error
  subclass: unknown
}
