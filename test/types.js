import test from 'ava'
import modernErrors from 'modern-errors'

test('Validate error name', (t) => {
  t.throws(() => modernErrors().InternalError)
})

test('Creates error types', (t) => {
  const { InputError } = modernErrors()
  const error = new InputError('message')
  t.true(error instanceof Error)
  t.true(error instanceof InputError)
  t.is(error.name, 'InputError')
  t.is(error.message, 'message')
})

test('Passes onCreate()', (t) => {
  const { InputError } = modernErrors({
    onCreate(error, params) {
      error.args = params
    },
  })
  const {
    args: { prop },
  } = new InputError('message', { prop: true })
  t.true(prop)
})
