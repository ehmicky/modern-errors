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
  const error = new InputError('test', { cause: new Error('innerTest') })
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

test('error.toJSON() is not enumerable', (t) => {
  const { InputError } = modernErrors()
  const error = new InputError('test')
  t.false(
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(error), 'toJSON')
      .enumerable,
  )
})

test('parse() is a noop on non-error plain objects', (t) => {
  t.true(modernErrors().parse(true))
})

test('parse() handles unknown error types', (t) => {
  const errorObject = { name: 'InputError', message: 'test', stack: '' }
  const error = modernErrors().parse(errorObject)
  t.true(error instanceof Error)
  t.is(error.name, 'Error')
  t.is(error.message, errorObject.message)
})

test('parse() does not consider return properties to be error types', (t) => {
  const errorObject = { name: 'errorHandler', message: 'test', stack: '' }
  t.is(modernErrors().parse(errorObject).name, 'Error')
})
