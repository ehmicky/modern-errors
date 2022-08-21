import test from 'ava'
import { serialize } from 'error-serializer'
import modernErrors from 'modern-errors'
import { each } from 'test-each'

const nativeError = new TypeError('nativeTest')

// eslint-disable-next-line fp/no-class
class UnknownError extends Error {}
const unknownError = new UnknownError('otherTest')

const { InputError, parse } = modernErrors(['InputError'])
const inputError = new InputError('test')

test('Can serialize with error.toJSON()', (t) => {
  t.deepEqual(inputError.toJSON(), {
    name: inputError.name,
    message: inputError.message,
    stack: inputError.stack,
  })
})

test('error.toJSON() is not enumerable', (t) => {
  t.false(
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(inputError), 'toJSON')
      .enumerable,
  )
})

each([nativeError, unknownError], ({ title }, error) => {
  test(`Can only serialize top-level custom errors | ${title}`, (t) => {
    t.is(JSON.stringify(error), '{}')
  })
})

each([inputError, nativeError, unknownError], ({ title }, cause) => {
  test(`Can serialize nested errors | ${title}`, (t) => {
    const error = new InputError('test', { cause })
    t.deepEqual(error.toJSON().cause, {
      name: cause.name,
      message: cause.message,
      stack: cause.stack,
    })
  })
})

test('Can use parse()', (t) => {
  const error = new InputError('test', { cause: nativeError })
  t.deepEqual(parse(error.toJSON()), error)
})

test('parse() is a noop on non-error plain objects', (t) => {
  t.true(modernErrors([]).parse(true))
})

each(
  [
    { error: nativeError, name: nativeError.name },
    { error: unknownError, name: 'Error' },
  ],
  ({ title }, { error, name }) => {
    test(`parse() handles native and unknown error classes | ${title}`, (t) => {
      const errorObject = serialize(error)
      const newError = modernErrors([]).parse(errorObject)
      t.true(newError instanceof Error)
      t.is(newError.name, name)
      t.is(newError.message, errorObject.message)
      t.is(newError.stack, errorObject.stack)
    })
  },
)

test('parse() does not consider return properties to be error classes', (t) => {
  const errorObject = { name: 'errorHandler', message: 'test', stack: '' }
  t.is(modernErrors([]).parse(errorObject).name, 'Error')
})

test('Can use serialize and parse deeply', (t) => {
  const error = new InputError('test', { cause: nativeError })
  const jsonString = JSON.stringify([{ error, prop: true }])
  const parsedValue = JSON.parse(jsonString, (key, value) => parse(value))
  t.true(parsedValue[0].prop)
  t.deepEqual(parsedValue[0].error, error)
})
