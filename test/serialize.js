import test from 'ava'
import modernErrors from 'modern-errors'

test('Can serialize with error.toJSON()', (t) => {
  const { InputError } = modernErrors()
  const cause = new Error('innerTest')
  const error = new InputError('test', { cause })
  t.deepEqual(error.toJSON(), {
    name: 'InputError',
    message: error.message,
    stack: error.stack,
    cause: { name: 'Error', message: cause.message, stack: cause.stack },
  })
})
