import test from 'ava'
import { each } from 'test-each'

import { ErrorClasses } from '../../helpers/main.js'
import { TEST_PLUGIN } from '../../helpers/plugin.js'

each(ErrorClasses, [undefined, true], ({ title }, ErrorClass, value) => {
  test(`plugin.properties() must return a plain object | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', {
      plugins: [{ ...TEST_PLUGIN, properties: () => value }],
    })
    t.throws(() => new TestError('test'))
  })
})

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`plugin.properties() is optional | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', {
      plugins: [{ ...TEST_PLUGIN, properties: undefined }],
    })
    t.false('properties' in new TestError('test'))
  })

  test(`plugin.properties() can wrap error itself | ${title}`, (t) => {
    const prefix = 'prefix: '
    const message = 'test'
    const plugin = {
      ...TEST_PLUGIN,
      properties({ error, ErrorClass: ErrorClassArg }) {
        const wrappedError = error.message.startsWith(prefix)
          ? error
          : new ErrorClassArg(prefix, { cause: error })
        return { wrappedError }
      },
    }
    const TestError = ErrorClass.subclass('TestError', { plugins: [plugin] })
    t.is(new TestError(message).wrappedError.message, `${prefix}${message}`)
  })

  test(`plugin.properties() can modify the same properties | ${title}`, (t) => {
    const names = ['one', 'two']
    const plugins = names.map((name) => ({
      name,
      properties: ({ error }) => ({ message: `${error.message}${name}` }),
    }))
    const TestError = ErrorClass.subclass('TestError', { plugins })
    const { message, stack } = new TestError('')
    t.is(message, names.join(''))
    t.true(stack.includes(names.join('')))
  })

  test(`plugin.properties() child plugins are not called again when wrapped | ${title}`, (t) => {
    // eslint-disable-next-line fp/no-let
    let count = 0
    const TestError = ErrorClass.subclass('TestError', {
      plugins: [
        {
          ...TEST_PLUGIN,
          properties() {
            // eslint-disable-next-line fp/no-mutation
            count += 1
            return { count }
          },
        },
      ],
    })
    const cause = new TestError('causeMessage')
    t.is(cause.count, 1)
    const error = new ErrorClass('message', { cause })
    t.is(error, cause)
    t.is(error.count, 1)
  })
})
