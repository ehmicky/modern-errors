import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

const { ErrorSubclasses } = getClasses({ plugins: [TEST_PLUGIN] })
const { ErrorClasses } = getClasses()

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`plugin.staticMethods are set on ErrorClass | ${title}`, (t) => {
    t.is(typeof ErrorClass.getProp, 'function')
  })
})

each(
  ErrorClasses,
  Reflect.ownKeys(Error),
  ({ title }, ErrorClass, propName) => {
    test(`plugin.staticMethods cannot redefine native Error.* | ${title}`, (t) => {
      t.throws(
        ErrorClass.subclass.bind(undefined, 'TestError', {
          plugins: [{ ...TEST_PLUGIN, staticMethods: { [propName]() {} } }],
        }),
      )
    })
  },
)
