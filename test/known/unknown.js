import test from 'ava'
import modernErrors from 'modern-errors'
import { each } from 'test-each'

each(
  [
    class extends Error {
      constructor() {
        throw new Error('unsafe')
      }
    },
    class extends Error {
      constructor(message, { cause = new Error('') } = {}) {
        super(message, { cause, stack: cause.stack.trim() })
      }
    },
    class extends Error {
      constructor(message, { cause = {} } = {}) {
        super(message, { cause, stack: cause.stack })
      }
    },
    class extends Error {
      constructor() {
        // eslint-disable-next-line no-constructor-return
        return new Error('test')
      }
    },
  ],
  ({ title }, custom) => {
    test(`Validate UnknownError constructor | ${title}`, (t) => {
      t.throws(modernErrors.bind(undefined, { UnknownError: { custom } }))
    })
  },
)
