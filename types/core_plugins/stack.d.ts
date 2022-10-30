import type { Info } from '../main.js'

export default plugin
declare const plugin: {
  name: 'stack'
  properties: (info: Info['properties']) => { stack: string }
}
