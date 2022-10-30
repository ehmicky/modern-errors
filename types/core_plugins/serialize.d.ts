import type { ErrorObject } from 'error-serializer'

import type { Info, ErrorInstance } from '../main.js'

export default plugin
declare const plugin: {
  name: 'serialize'
  instanceMethods: {
    toJSON: (info: Info['instanceMethods']) => ErrorObject
  }
  staticMethods: {
    parse: (
      info: Info['staticMethods'],
      errorObject: ErrorObject,
    ) => ErrorInstance
  }
}
