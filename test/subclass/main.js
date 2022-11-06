import test from 'ava'
import { each } from 'test-each'

import { KnownErrorClasses } from '../helpers/known.js'

each(KnownErrorClasses, ({ title }, ErrorClass) => {
  test(`Does not modify invalid classes | ${title}`, (t) => {
    class custom extends Object {}
    t.throws(ErrorClass.subclass.bind(undefined, 'TestError', { custom }))
    t.false('name' in custom.prototype)
  })

  test(`Static methods are not enumerable | ${title}`, (t) => {
    t.deepEqual(Object.keys(ErrorClass), [])
  })
})
