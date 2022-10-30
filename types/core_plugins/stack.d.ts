import type { Info } from '../main.js'

/**
 * `modern-errors-stack` plugin.
 *
 * This plugin
 * [cleans up stack traces](https://github.com/sindresorhus/clean-stack).
 */
declare const plugin: {
  name: 'stack'
  properties: (info: Info['properties']) => { stack: string }
}
export default plugin
