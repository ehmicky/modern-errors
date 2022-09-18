import test from 'ava'
import { each } from 'test-each'

import { createAnyError, defineClassOpts } from '../helpers/main.js'

each(['AnyError', 'TestError', 'UnknownError'], ({ title }, errorName) => {
  test(`Cannot extend without subclass() | ${title}`, (t) => {
    const ParentError = defineClassOpts()[errorName]
    class ChildError extends ParentError {}
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new ChildError('test'))
  })

  test(`Can extend with subclass() | ${title}`, (t) => {
    const ParentError = defineClassOpts()[errorName]
    const ChildError = ParentError.subclass('ChildError', {
      custom: class extends ParentError {},
    })
    t.is(new ChildError('test').name, 'ChildError')
  })
})

test('Cannot instantiate AnyError before AnyError.subclass()', (t) => {
  const TestAnyError = createAnyError()
  t.throws(() => new TestAnyError('', { cause: '' }))
})
