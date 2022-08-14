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

test('Can use parse()', (t) => {
  const { InputError, parse } = modernErrors()
  const cause = new Error('innerTest')
  const error = new InputError('test', { cause })
  t.deepEqual(parse(error.toJSON()), error)
})

test('Can use serialize and parse deeply', (t) => {
  const { InputError, parse } = modernErrors()
  const cause = new Error('innerTest')
  const error = new InputError('test', { cause })
  const jsonString = JSON.stringify([{ error, prop: true }])
  const parsedValue = JSON.parse(jsonString, (key, value) => parse(value))
  t.true(parsedValue[0].prop)
  t.deepEqual(parsedValue[0].error, error)
})
