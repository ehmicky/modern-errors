import test from 'ava'
import { each } from 'test-each'

import { KnownErrorClasses } from '../helpers/known.js'
import { defineGlobalOpts } from '../helpers/main.js'

each(KnownErrorClasses, ({ title }, ErrorClass) => {
  test(`Cannot extend without subclass() | ${title}`, (t) => {
    class ChildError extends ErrorClass {}
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new ChildError('test'))
  })

  test(`Can extend with subclass() | ${title}`, (t) => {
    const name = `${ErrorClass.name}ExtendChildError`
    const ChildError = ErrorClass.subclass(name)
    t.is(new ChildError('test').name, name)
  })
})

test('Can instantiate AnyError without any subclass', (t) => {
  const { AnyError: TestAnyError } = defineGlobalOpts()
  t.true(new TestAnyError('') instanceof TestAnyError)
})
