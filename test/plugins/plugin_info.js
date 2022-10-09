import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts, defineGlobalOpts } from '../helpers/main.js'

const { TestError, AnyError, UnknownError } = defineClassOpts()

const getSetArgs = function ({
  ErrorClasses: { TestError: TestErrorClass = TestError } = {},
  instanceOpts,
}) {
  return new TestErrorClass('test', instanceOpts).properties
}

const getInstanceArgs = function ({
  ErrorClasses: { TestError: TestErrorClass = TestError } = {},
  instanceOpts,
  methodOpts,
}) {
  return new TestErrorClass('test', instanceOpts).getInstance(methodOpts)
}

const getStaticArgs = function ({
  ErrorClasses: { AnyError: AnyErrorClass = AnyError } = {},
  methodOpts,
}) {
  return AnyErrorClass.getProp(methodOpts)
}

each([getSetArgs, getInstanceArgs, getStaticArgs], ({ title }, getValues) => {
  test(`plugin.properties|instanceMethods|staticMethods is passed AnyError | ${title}`, (t) => {
    t.is(getValues({}).AnyError, AnyError)
  })

  test(`plugin.properties|instanceMethods|staticMethods is passed ErrorClasses | ${title}`, (t) => {
    t.deepEqual(getValues({}).ErrorClasses, { TestError, UnknownError })
  })

  test(`plugin.properties|instanceMethods|staticMethods cannot modify ErrorClasses | ${title}`, (t) => {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    getValues({}).ErrorClasses.prop = true
    t.false('prop' in AnyError.getProp().ErrorClasses)
  })

  test(`plugin.properties|instanceMethods|staticMethods cannot modify options | ${title}`, (t) => {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    getValues({}).options.prop = false
    t.is(AnyError.getProp().options.prop, undefined)
  })

  test(`plugin.properties|instanceMethods|staticMethods has "full: true" with getOptions() | ${title}`, (t) => {
    t.true(getValues({}).options.full)
  })

  test(`plugin.properties|instanceMethods|staticMethods is passed errorInfo | ${title}`, (t) => {
    t.is(typeof getValues({}).errorInfo, 'function')
  })
})

each([getSetArgs, getInstanceArgs, getStaticArgs], ({ title }, getValues) => {
  test(`plugin.properties|instanceMethods|staticMethods get the global options | ${title}`, (t) => {
    const ErrorClasses = defineGlobalOpts({ prop: true })
    t.true(getValues({ ErrorClasses }).options.prop)
  })
})

each([getSetArgs, getInstanceArgs], ({ title }, getValues) => {
  test(`plugin.properties|instanceMethods get the class options | ${title}`, (t) => {
    const ErrorClasses = defineClassOpts({ prop: true })
    t.true(getValues({ ErrorClasses }).options.prop)
  })

  test(`plugin.properties|instanceMethods get "unknownDeep" | ${title}`, (t) => {
    t.false(getValues({}).unknownDeep)
  })
})

test('plugin.properties gets the instance options', (t) => {
  const error = new TestError('test', { prop: true })
  t.true(error.properties.options.prop)
})

test('plugin.instanceMethods gets the instance options', (t) => {
  const error = new TestError('test', { prop: true })
  t.true(error.getInstance().options.prop)
})

test('plugin.properties gets the error', (t) => {
  t.true(new TestError('test').properties.error instanceof Error)
})

test('plugin.instanceMethods gets the error', (t) => {
  t.true(new TestError('test').getInstance().error instanceof Error)
})
