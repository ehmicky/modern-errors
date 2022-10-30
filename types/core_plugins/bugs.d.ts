import type { Info } from '../main.js'

/**
 * `modern-errors-bugs` plugin
 */
export default plugin
declare const plugin: {
  name: 'bugs'
  getOptions: (input: string) => string
  properties: (info: Info['properties']) => { message: string }
}
