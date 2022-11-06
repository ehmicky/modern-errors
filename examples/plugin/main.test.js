import assert from 'node:assert'

import modernErrors from 'modern-errors'
import modernErrorsExample from 'modern-errors-example'

const BaseError = modernErrors([modernErrorsExample])
const error = new BaseError('', { cause: '' })

assert.equal(error.exampleMethod(), 'expectedValue')
