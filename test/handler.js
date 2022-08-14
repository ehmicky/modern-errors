import test from 'ava'
import modernErrors from 'modern-errors'

test('errorHandler() merges error.cause', (t) => {
  const error = new Error('test', { cause: new Error('cause') })
  t.is(modernErrors().errorHandler(error).message, 'cause\ntest')
})

test('errorHandler() keeps error type if listed', (t) => {
  const { InputError, errorHandler } = modernErrors()
  t.is(errorHandler(new InputError('test')).name, 'InputError')
})

test('errorHandler() uses InternalError if not listed', (t) => {
  const { errorHandler } = modernErrors()
  const { name, message } = errorHandler(new Error('test'))
  t.is(name, 'InternalError')
  t.is(message, 'test')
})

test('InternalError uses bugsUrl if defined', (t) => {
  const bugsUrl = import.meta.url
  const { errorHandler } = modernErrors({ bugsUrl })
  const { message } = errorHandler(new Error('test'))
  t.true(message.startsWith('test\n'))
  t.true(message.includes(bugsUrl))
})
