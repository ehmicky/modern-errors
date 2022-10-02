import test from 'ava'
import { each } from 'test-each'

import { TestError, AnyError } from '../../helpers/winston.js'

const { transform } = AnyError.shortFormat()
const { transform: fullTransform } = AnyError.fullFormat()

each([transform, fullTransform], ({ title }, transformFunc) => {
  test(`Sets level to error by default | ${title}`, (t) => {
    const error = new TestError('test')
    t.is(transformFunc(error).level, 'error')
  })

  test(`Can set other level | ${title}`, (t) => {
    const error = new TestError('test', { winston: { level: 'warn' } })
    t.is(transformFunc(error).level, 'warn')
  })
})

each(
  [new TestError('test', { winston: { stack: false } }), new TestError('test')],
  ({ title }, error) => {
    test(`Does not use the stack if "stack" is false | ${title}`, (t) => {
      t.is(transform(error).message, `${error.name}: ${error.message}`)
    })
  },
)

each(
  [
    new TestError('test', { winston: { stack: true } }),
    new AnyError('test', { cause: '' }),
  ],
  ({ title }, error) => {
    test(`Use the stack if "stack" is true | ${title}`, (t) => {
      t.is(transform(error).message, error.stack)
    })
  },
)

each(['name', 'message'], ({ title }, propName) => {
  test(`Use the prepended stack if "stack" is true and it misses the name or message | ${title}`, (t) => {
    const error = new TestError('message', { winston: { stack: true } })
    error.stack = error.stack.replace(error[propName], '')
    t.is(
      transform(error).message,
      `${error.name}: ${error.message}\n${error.stack}`,
    )
  })
})
