import test from 'ava'
import { each } from 'test-each'

import { ErrorSubclasses } from '../helpers/plugin.js'

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`plugin.staticMethods are set on ErrorClass | ${title}`, (t) => {
    t.is(typeof ErrorClass.getProp, 'function')
  })

  test(`plugin.staticMethods context is bound | ${title}`, (t) => {
    const { getProp } = ErrorClass
    t.deepEqual(getProp(0).args, [0])
  })

  test(`Plugin static methods are not enumerable | ${title}`, (t) => {
    t.deepEqual(Object.keys(ErrorClass), [])
  })
})
