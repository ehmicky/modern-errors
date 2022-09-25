import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts, defineGlobalOpts } from '../helpers/main.js'

const { TestError, AnyError, UnknownError } = defineClassOpts()

const getSetArgs = function ({ TestError: TestErrorClass = TestError } = {}) {
  return new TestErrorClass('test').set
}

const getInstanceArgs = function ({
  TestError: TestErrorClass = TestError,
} = {}) {
  return new TestErrorClass('test').getInstance()
}

const getStaticArgs = function ({ AnyError: AnyErrorClass = AnyError } = {}) {
  return AnyErrorClass.getProp()
}

each([getSetArgs, getInstanceArgs, getStaticArgs], ({ title }, getValues) => {
  test(`plugin.set|instanceMethods|staticMethods is passed AnyError | ${title}`, (t) => {
    t.is(getValues().AnyError, AnyError)
  })

  test(`plugin.set|instanceMethods|staticMethods is passed ErrorClasses | ${title}`, (t) => {
    t.deepEqual(getValues().ErrorClasses, { TestError, UnknownError })
  })

  test(`plugin.set|instanceMethods|staticMethods cannot modify ErrorClasses | ${title}`, (t) => {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    getValues().ErrorClasses.prop = true
    t.false('prop' in AnyError.getProp().ErrorClasses)
  })

  test(`plugin.set|instanceMethods|staticMethods cannot modify options | ${title}`, (t) => {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    getValues().options.prop = false
    t.is(AnyError.getProp().options.prop, undefined)
  })

  test(`plugin.set|instanceMethods|staticMethods has "full: true" with getOptions() | ${title}`, (t) => {
    t.true(getValues().options.full)
  })
})

each([getSetArgs, getInstanceArgs, getStaticArgs], ({ title }, getValues) => {
  test(`plugin.set|instanceMethods|staticMethods get the global options | ${title}`, (t) => {
    const ErrorClasses = defineGlobalOpts({ prop: true })
    t.true(getValues(ErrorClasses).options.prop)
  })
})

each([getSetArgs, getInstanceArgs], ({ title }, getValues) => {
  test(`plugin.set|instanceMethods get the class options | ${title}`, (t) => {
    const ErrorClasses = defineClassOpts({ prop: true })
    t.true(getValues(ErrorClasses).options.prop)
  })
})

test('plugin.set gets the instance options', (t) => {
  const error = new TestError('test', { prop: true })
  t.true(error.set.options.prop)
})

test('plugin.instanceMethods gets the instance options', (t) => {
  const error = new TestError('test', { prop: true })
  t.true(error.getInstance().options.prop)
})

test('plugin.set gets the error', (t) => {
  t.true(new TestError('test').set.error instanceof Error)
})

test('plugin.instanceMethods gets the error', (t) => {
  t.true(new TestError('test').getInstance().error instanceof Error)
})
