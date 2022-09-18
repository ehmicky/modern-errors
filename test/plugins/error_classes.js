import test from 'ava'

import { defineSimpleClass } from '../helpers/main.js'

const { TestError, UnknownError, AnyError } = defineSimpleClass()

test('plugin.set() is passed ErrorClasses', (t) => {
  t.deepEqual(new TestError('test').set.ErrorClasses, {
    TestError,
    UnknownError,
  })
})

test('plugin.unset() is passed ErrorClasses', (t) => {
  const cause = new TestError('causeMessage')
  t.deepEqual(new TestError('test', { cause }).unset.ErrorClasses, {
    TestError,
    UnknownError,
  })
})

test('plugin.instanceMethods are passed ErrorClasses', (t) => {
  t.deepEqual(new TestError('message').getInstance().ErrorClasses, {
    TestError,
    UnknownError,
  })
})

test('plugin.staticMethods is passed ErrorClasses', (t) => {
  t.deepEqual(AnyError.getProp().ErrorClasses, { TestError, UnknownError })
})

test('plugin.set() cannot modify ErrorClasses', (t) => {
  const error = new TestError('test')
  error.set.ErrorClasses.prop = true
  t.false('prop' in error.getInstance().ErrorClasses)
})

test('plugin.unset() cannot modify ErrorClasses', (t) => {
  const cause = new TestError('causeMessage')
  const error = new TestError('test', { cause })
  error.unset.ErrorClasses.prop = true
  t.false('prop' in error.getInstance().ErrorClasses)
})

test('plugin.instanceMethods cannot modify ErrorClasses', (t) => {
  const error = new TestError('message')
  // eslint-disable-next-line fp/no-mutation
  error.getInstance().ErrorClasses.prop = true
  t.false('prop' in error.getInstance().ErrorClasses)
})

test('plugin.staticMethods cannot modify ErrorClasses', (t) => {
  // eslint-disable-next-line fp/no-mutation
  AnyError.getProp().ErrorClasses.prop = true
  t.false('prop' in AnyError.getProp().ErrorClasses)
})
