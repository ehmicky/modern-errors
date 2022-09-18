import test from 'ava'
import { each } from 'test-each'

import { defineClassesOpts } from '../helpers/main.js'

each(
  [
    () => ({ error: {} }),
    () => ({ error: new Error('test') }),
    () => {
      throw new Error('unsafe')
    },
    (message, { cause = new Error('') } = {}) => {
      cause.stack.trim()
      return {}
    },
    (message, { cause = {} } = {}) => {
      // eslint-disable-next-line no-unused-expressions
      cause.stack
      return {}
    },
    (message) => ({ args: [message] }),
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
                const { error, args: argsA = args } = custom(...args)
                super(...argsA)
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
