import type { Info } from '../main.js'

/**
 * `modern-errors-bugs` plugin.
 *
 * The `bugs` option appends a bug reports URL to error messages.
 *
 * @example
 * ```js
 * export const UnknownError = AnyError.subclass('UnknownError', {
 *   bugs: 'https://github.com/my-name/my-project/issues',
 * })
 *
 * // UnknownError: Cannot read properties of null (reading 'trim')
 * // Please report this bug at: https://github.com/my-name/my-project/issues
 * ```
 */
declare const plugin: {
  name: 'bugs'
  getOptions: (input: string) => string
  properties: (info: Info['properties']) => { message: string }
}
export default plugin
