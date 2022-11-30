import test from 'ava'
import { each } from 'test-each'

import { ErrorClasses, ModernError } from '../helpers/main.test.js'

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`error.errors can be set | ${title}`, (t) => {
    t.deepEqual(new ErrorClass('test', { errors: [] }).errors, [])
  })

  test(`error.errors is validated | ${title}`, (t) => {
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
    const one = new ErrorClass('one')
    const two = new ErrorClass('two')
    const cause = new ErrorClass('causeMessage', { errors: [one] })
    const error = new ErrorClass('message', { cause, errors: [two] })
    t.deepEqual(error.errors, [one, two])
  })
})

each(
  ErrorClasses,
  [undefined, {}, { errors: undefined }],
  ({ title }, ErrorClass, opts) => {
    test(`error.errors are not set by default | ${title}`, (t) => {
      t.false('errors' in new ErrorClass('test', opts))
    })
  },
)
