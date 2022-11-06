import assert from 'node:assert'

import modernErrors from 'modern-errors'
import modernErrorsExample from 'modern-errors-example'

const AnyError = modernErrors([modernErrorsExample])
const error = new AnyError('', { cause: '' })

assert.equal(error.exampleMethod(), 'expectedValue')
