import type { Info } from '../main.js'

/**
 * `modern-errors-stack` plugin
 */
export default plugin
declare const plugin: {
  name: 'stack'
  properties: (info: Info['properties']) => { stack: string }
}
