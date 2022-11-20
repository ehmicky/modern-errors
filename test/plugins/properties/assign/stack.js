import test from 'ava'
import { each } from 'test-each'

import { ErrorSubclasses } from '../../../helpers/plugin.js'

each(ErrorSubclasses, ['message', 'stack'], ({ title }, ErrorClass, key) => {
  test(`plugin.properties() can set some core properties | ${title}`, (t) => {
    const error = new ErrorClass('test', { prop: { toSet: { [key]: '0' } } })
    t.is(error[key], '0')
    t.false(Object.getOwnPropertyDescriptor(error, key).enumerable)
  })
})

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  const stack = new ErrorClass('test').stack.replace(
    `${ErrorClass.name}: test`,
    `${ErrorClass.name}: testMessage`,
  )

  test(`plugin.properties() updates stack when message is updated | ${title}`, (t) => {
    const error = new ErrorClass('test', {
      prop: { toSet: { message: 'testMessage' } },
    })
    t.true(error.stack.includes('testMessage'))
  })

  test(`plugin.properties() updates message when stack is updated | ${title}`, (t) => {
    const error = new ErrorClass('test', {
      prop: { toSet: { stack } },
    })
    t.is(error.message, 'testMessage')
  })

  test(`plugin.properties() can set both message and stack when in sync | ${title}`, (t) => {
    const oldMessage = 'one'
    const message = 'two'
    const stackPrefix = 'Stack: '
    const error = new ErrorClass(oldMessage, {
      prop: { toSet: { message, stack: `${stackPrefix}${oldMessage}` } },
    })
    t.is(error.message, message)
    t.is(error.stack, `${stackPrefix}${message}`)
  })

  test(`plugin.properties() can set both message and stack when not in sync | ${title}`, (t) => {
    const error = new ErrorClass('test', {
      prop: { toSet: { message: 'otherMessage', stack } },
    })
    t.is(error.message, 'otherMessage')
    t.true(error.stack.includes('otherMessage'))
    t.false(error.stack.includes('testMessage'))
  })
})
