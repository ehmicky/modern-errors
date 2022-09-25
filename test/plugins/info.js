import test from 'ava'

import { defineClassOpts } from '../helpers/main.js'

const { TestError, UnknownError, AnyError } = defineClassOpts()

const testError = new TestError('test')

test('plugin.set() is passed AnyError', (t) => {
  t.is(testError.set.AnyError, AnyError)
})

test('plugin.instanceMethods are passed AnyError', (t) => {
  t.is(testError.getInstance().AnyError, AnyError)
})

test('plugin.staticMethods are passed AnyError', (t) => {
  t.is(AnyError.getProp().AnyError, AnyError)
})

test('plugin.set() is passed ErrorClasses', (t) => {
  t.deepEqual(testError.set.ErrorClasses, { TestError, UnknownError })
})

test('plugin.instanceMethods are passed ErrorClasses', (t) => {
  t.deepEqual(testError.getInstance().ErrorClasses, { TestError, UnknownError })
})

test('plugin.staticMethods are passed ErrorClasses', (t) => {
  t.deepEqual(AnyError.getProp().ErrorClasses, { TestError, UnknownError })
})

test('plugin.set() cannot modify ErrorClasses', (t) => {
  const error = new TestError('test')
  error.set.ErrorClasses.prop = true
  t.false('prop' in error.getInstance().ErrorClasses)
})

test('plugin.instanceMethods cannot modify ErrorClasses', (t) => {
  const error = new TestError('test')
  // eslint-disable-next-line fp/no-mutation
  error.getInstance().ErrorClasses.prop = true
  t.false('prop' in error.getInstance().ErrorClasses)
})

test('plugin.staticMethods cannot modify ErrorClasses', (t) => {
  // eslint-disable-next-line fp/no-mutation
  AnyError.getProp().ErrorClasses.prop = true
  t.false('prop' in AnyError.getProp().ErrorClasses)
})
