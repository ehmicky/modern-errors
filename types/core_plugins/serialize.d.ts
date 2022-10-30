import type { ErrorObject } from 'error-serializer'

import type { Info, ErrorInstance } from '../main.js'

export type { ErrorObject }

/**
 * `modern-errors-serialize` plugin.
 *
 * This plugin allows serializing and parsing errors to JSON.
 */
declare const plugin: {
  name: 'serialize'
  instanceMethods: {
    /**
     * Converts errors to plain objects that are
     * [serializable](https://github.com/ehmicky/error-serializer#json-safety)
     * to JSON
     * ([or YAML](https://github.com/ehmicky/error-serializer#custom-serializationparsing),
     * etc.). It is
     * [automatically called](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior)
     * by `JSON.stringify()`. All error properties
     * [are kept](https://github.com/ehmicky/error-serializer#additional-error-properties).
     *
     * @example
     * ```js
     * const error = new InputError('Wrong file.', { props: { filePath } })
     * const errorObject = error.toJSON()
     * // { name: 'InputError', message: 'Wrong file', stack: '...', filePath: '...' }
     * const errorString = JSON.stringify(error)
     * // '{"name":"InputError",...}'
     * ```
     */
    toJSON: (info: Info['instanceMethods']) => ErrorObject
  }
  staticMethods: {
    /**
     * `AnyError.parse(errorObject)` converts error plain objects back to
     * identical error instances. The original error class is preserved.
     *
     * @example
     * ```js
     * const newErrorObject = JSON.parse(errorString)
     * const newError = AnyError.parse(newErrorObject)
     * // InputError: Wrong file.
     * //     at ...
     * //   filePath: '...'
     * ```
     */
    parse: (
      info: Info['staticMethods'],
      errorObject: ErrorObject,
    ) => ErrorInstance
  }
}
export default plugin
