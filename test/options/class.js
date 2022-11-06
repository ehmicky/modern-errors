import test from 'ava'
import { each } from 'test-each'

import { getPluginClasses } from '../helpers/main.js'

const { ErrorClasses, ErrorSubclasses } = getPluginClasses()

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`Validate invalid class options | ${title}`, (t) => {
    t.throws(ErrorClass.subclass.bind(undefined, 'TestError', true))
  })
})

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`Can pass class options | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', { prop: true })
    t.true(new TestError('test').properties.options.prop)
  })

  test(`Class options are readonly | ${title}`, (t) => {
    const prop = { one: true }
    const TestError = ErrorClass.subclass('TestError', { prop })
    // eslint-disable-next-line fp/no-mutation
    prop.one = false
    t.true(new TestError('test').properties.options.prop.one)
  })

  test(`Cannot pass unknown options | ${title}`, (t) => {
    t.throws(ErrorClass.subclass.bind(undefined, 'TestError', { one: true }))
  })

  test(`Child class options have priority over parent ones | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', { prop: false })
    const SubTestError = TestError.subclass('SubTestError', { prop: true })
    t.true(new SubTestError('test').properties.options.prop)
  })

  test(`Undefined child class options are ignored | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', { prop: true })
    const SubTestError = TestError.subclass('SubTestError', { prop: undefined })
    t.true(new SubTestError('test').properties.options.prop)
  })

  test(`Object child options are shallowly merged to parent options | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', {
      prop: { one: false, two: { three: false }, five: false },
    })
    const SubTestError = TestError.subclass('SubTestError', {
      prop: { one: true, two: { three: true }, four: true },
    })
    t.deepEqual(new SubTestError('test').properties.options.prop, {
      one: true,
      two: { three: true },
      four: true,
      five: false,
    })
  })

  test(`plugin.getOptions() full is false for class options | ${title}`, (t) => {
    t.throws(
      ErrorClass.subclass.bind(undefined, 'TestError', { prop: 'partial' }),
    )
  })
})
