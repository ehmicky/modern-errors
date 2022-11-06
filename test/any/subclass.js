import test from 'ava'
import { each } from 'test-each'

import { defineGlobalOpts, defineClassOpts } from '../helpers/main.js'

each(['AnyError', 'TestError'], ({ title }, errorName) => {
  test(`Cannot extend without subclass() | ${title}`, (t) => {
    const ParentError = defineClassOpts()[errorName]
    class ChildError extends ParentError {}
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new ChildError('test'))
  })

  test(`Can extend with subclass() | ${title}`, (t) => {
    const ParentError = defineClassOpts()[errorName]
    const ChildError = ParentError.subclass('ChildError')
    t.is(new ChildError('test').name, 'ChildError')
  })
})

test('Can instantiate AnyError without any subclass', (t) => {
  const { AnyError: TestAnyError } = defineGlobalOpts()
  t.true(new TestAnyError('') instanceof TestAnyError)
})
