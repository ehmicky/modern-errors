import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../helpers/main.js'

const { ErrorClasses } = getClasses()

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`Cannot extend without subclass() | ${title}`, (t) => {
    class ChildError extends ErrorClass {}
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new ChildError('test'))
  })

  test(`Can extend with subclass() | ${title}`, (t) => {
    const ChildError = ErrorClass.subclass('ChildError')
    t.is(new ChildError('test').constructor, ChildError)
  })
})
