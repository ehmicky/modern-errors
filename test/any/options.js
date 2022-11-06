import test from 'ava'
import { each } from 'test-each'

import { KnownErrorClasses } from '../helpers/known.js'

each(KnownErrorClasses, [undefined, {}], ({ title }, ErrorClass, opts) => {
  test(`Allows empty options | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.notThrows(() => new ErrorClass('test', opts))
  })
})

each(
  KnownErrorClasses,
  [null, '', { custom: true }],
  ({ title }, ErrorClass, opts) => {
    test(`Validate against invalid options | ${title}`, (t) => {
      // eslint-disable-next-line max-nested-callbacks
      t.throws(() => new ErrorClass('test', opts))
    })
  },
)
