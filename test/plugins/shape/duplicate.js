import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../../helpers/main.js'

const { ErrorClasses } = getClasses()

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`plugin.staticMethods cannot be defined twice by different plugins | ${title}`, (t) => {
    t.throws(
      ErrorClass.subclass.bind(undefined, 'TestError', {
        plugins: [
          { name: 'one', staticMethods: { one() {} } },
          { name: 'two', staticMethods: { one() {} } },
        ],
      }),
    )
  })

  test(`plugin.instanceMethods cannot be defined twice by different plugins | ${title}`, (t) => {
    t.throws(
      ErrorClass.subclass.bind(undefined, 'TestError', {
        plugins: [
          { name: 'one', instanceMethods: { one() {} } },
          { name: 'two', instanceMethods: { one() {} } },
        ],
      }),
    )
  })
})
