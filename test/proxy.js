import test from 'ava'
import modernErrors from 'modern-errors'

test('Can enumerate new error types', (t) => {
  const returnValue = modernErrors()
  t.is(returnValue.unknown, undefined)
  t.deepEqual(Object.keys(returnValue), ['errorHandler'])
  t.true(new returnValue.InputError('test') instanceof Error)
  t.deepEqual(Object.keys(returnValue), ['errorHandler', 'InputError'])
})

test('Can use "in" with return value', (t) => {
  const returnValue = modernErrors()
  t.false('unknown' in returnValue)
  t.true('InputError' in returnValue)
  t.deepEqual(Object.keys(returnValue), ['errorHandler', 'InputError'])
})

test('Can use "getOwnPropertyDescriptor()" with return value', (t) => {
  const returnValue = modernErrors()
  t.is(Object.getOwnPropertyDescriptor(returnValue, 'unknown'), undefined)
  const { value } = Object.getOwnPropertyDescriptor(returnValue, 'InputError')
  t.is(typeof value, 'function')
  t.deepEqual(Object.keys(returnValue), ['errorHandler', 'InputError'])
})
