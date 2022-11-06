import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../../helpers/main.js'
import { TEST_PLUGIN } from '../../helpers/plugin.js'

const { ErrorClasses } = getClasses()

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`Should allow valid plugins | ${title}`, (t) => {
    t.notThrows(
      ErrorClass.subclass.bind(undefined, 'TestError', {
        plugins: [TEST_PLUGIN],
      }),
    )
  })

  test(`Should allow passing no plugins | ${title}`, (t) => {
    t.notThrows(
      ErrorClass.subclass.bind(undefined, 'TestError', { plugins: [] }),
    )
  })

  test(`Should validate plugins is an array | ${title}`, (t) => {
    t.throws(
      ErrorClass.subclass.bind(undefined, 'TestError', { plugins: true }),
    )
  })

  test(`Should validate plugin is an object | ${title}`, (t) => {
    t.throws(
      ErrorClass.subclass.bind(undefined, 'TestError', { plugins: [true] }),
    )
  })

  test(`Should inherit plugins | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', {
      plugins: [{ name: 'one', properties: () => ({ one: true }) }],
    })
    const testError = new TestError('test')
    t.true(testError.one)
    t.false('two' in testError)

    const SubTestError = TestError.subclass('SubTestError', {
      plugins: [{ name: 'two', properties: () => ({ two: true }) }],
    })
    const subTestError = new SubTestError('test')
    t.true(subTestError.one)
    t.true(subTestError.two)
  })
})

each(
  ErrorClasses,
  [
    { isOptions: undefined },
    { getOptions: undefined },
    { properties: undefined },
    { instanceMethods: undefined },
    { staticMethods: undefined },
    { instanceMethods: {} },
    { staticMethods: {} },
  ],
  ({ title }, ErrorClass, opts) => {
    test(`Should allow optional properties | ${title}`, (t) => {
      t.notThrows(
        ErrorClass.subclass.bind(undefined, 'TestError', {
          plugins: [{ ...TEST_PLUGIN, ...opts }],
        }),
      )
    })
  },
)

each(
  ErrorClasses,
  ['isOptions', 'getOptions', 'properties'],
  ({ title }, ErrorClass, propName) => {
    test(`Should validate functions | ${title}`, (t) => {
      t.throws(
        ErrorClass.subclass.bind(undefined, 'TestError', {
          plugins: [{ ...TEST_PLUGIN, [propName]: true }],
        }),
      )
    })
  },
)
