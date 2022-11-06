import test from 'ava'
import { each } from 'test-each'

import { KnownErrorClasses, SpecificErrorClasses } from '../helpers/known.js'

const properties = () => ({})

each(KnownErrorClasses, ({ title }, ErrorClass) => {
  test(`plugin.getOptions() forbids options by default | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', {
      plugins: [{ name: 'one', properties }],
    })
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new TestError('test', { one: true }))
  })
})

each(
  KnownErrorClasses,
  [undefined, {}, { one: undefined }],
  ({ title }, ErrorClass, opts) => {
    test(`plugin.getOptions() allows undefined options by default | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', {
        plugins: [{ name: 'one', properties }],
      })
      // eslint-disable-next-line max-nested-callbacks
      t.notThrows(() => new TestError('test', opts))
    })
  },
)

each(SpecificErrorClasses, ({ title }, ErrorClass) => {
  test(`plugin.getOptions() validate class options | ${title}`, (t) => {
    t.throws(
      ErrorClass.subclass.bind(undefined, 'TestError', { prop: 'invalid' }),
      { message: 'Invalid "prop" options: Invalid prop' },
    )
  })

  test(`plugin.getOptions() validate instance options | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new ErrorClass('test', { prop: 'invalid' }), {
      message: 'Invalid "prop" options: Invalid prop',
    })
  })
})
