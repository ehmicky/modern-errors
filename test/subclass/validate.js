import test from 'ava'
import { each } from 'test-each'

import { ErrorClasses } from '../helpers/main.js'

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`Cannot extend without subclass() | ${title}`, (t) => {
    class TestError extends ErrorClass {}
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new TestError('test'))
  })

  test(`Can extend with subclass() | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    t.is(new TestError('test').constructor, TestError)
  })
})
