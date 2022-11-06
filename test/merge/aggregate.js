import test from 'ava'
import { each } from 'test-each'

import { getClasses, ModernError } from '../helpers/main.js'

const { KnownErrorClasses } = getClasses()

each(KnownErrorClasses, ({ title }, ErrorClass) => {
  test(`error.errors can be set | ${title}`, (t) => {
    t.deepEqual(new ErrorClass('test', { errors: [] }).errors, [])
  })

  test(`error.errors is validated | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new ErrorClass('test', { errors: true }))
  })

  test(`error.errors is not enumerable | ${title}`, (t) => {
    t.false(
      Object.getOwnPropertyDescriptor(
        new ErrorClass('test', { errors: [] }),
        'errors',
      ).enumerable,
    )
  })

  test(`error.errors are normalized | ${title}`, (t) => {
    const [error] = new ErrorClass('test', { errors: [true] }).errors
    t.true(error instanceof Error)
    t.false(error instanceof ModernError)
  })

  test(`error.errors are appended to | ${title}`, (t) => {
    const one = new ModernError('one')
    const two = new ModernError('two')
    const cause = new ModernError('causeMessage', { errors: [one] })
    const error = new ErrorClass('message', { cause, errors: [two] })
    t.deepEqual(error.errors, [one, two])
  })
})

each(
  KnownErrorClasses,
  [undefined, {}, { errors: undefined }],
  ({ title }, ErrorClass, opts) => {
    test(`error.errors is not set by default | ${title}`, (t) => {
      t.false('errors' in new ErrorClass('test', opts))
    })
  },
)
