import test from 'ava'
import { each } from 'test-each'

import { defineClassesOpts, defineSimpleClass } from '../helpers/main.js'

const { TestError } = defineSimpleClass()

each(['subclass', 'normalize', 'getProp'], ({ title }, methodName) => {
  test(`Does not allow overriding AnyError.* | ${title}`, (t) => {
    t.throws(
      // eslint-disable-next-line max-nested-callbacks
      defineClassesOpts.bind(undefined, (AnyError) => ({
        PropCustomError: {
          custom: class extends AnyError {
            // eslint-disable-next-line max-nested-callbacks
            static [methodName]() {}
          },
        },
      })),
    )
  })

  test(`Does not allow calling ErrorClass.* | ${title}`, (t) => {
    t.throws(() => TestError[methodName]())
  })
})
