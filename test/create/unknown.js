import test from 'ava'
import { each } from 'test-each'

import { defineClassesOpts } from '../helpers/main.js'

each(
  [
    () => new Error('test'),
    () => {
      throw new Error('unsafe')
    },
    (message, { cause = new Error('') } = {}) => {
      cause.stack.trim()
    },
    (message, { cause = {} } = {}) => {
      // eslint-disable-next-line no-unused-expressions
      cause.stack
    },
  ],
  ({ title }, custom) => {
    test(`Validate UnknownError constructor | ${title}`, (t) => {
      t.throws(
        // eslint-disable-next-line max-nested-callbacks
        defineClassesOpts.bind(undefined, (AnyError) => ({
          UnknownError: {
            custom: class extends AnyError {
              // eslint-disable-next-line max-nested-callbacks
              constructor(...args) {
                const error = custom(...args)
                super(...args)
                // eslint-disable-next-line no-constructor-return
                return error
              }
            },
          },
        })),
      )
    })
  },
)
