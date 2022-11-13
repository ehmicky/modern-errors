import assert from 'node:assert'

import ModernError from 'modern-errors'
import modernErrorsExample from 'modern-errors-example'

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsExample],
})
const error = new BaseError('', { cause: '' })

assert.equal(error.exampleMethod(), 'expectedValue')
