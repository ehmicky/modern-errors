import test from 'ava'
import { each } from 'test-each'

import { TestError, AnyError, testLevel } from '../../helpers/winston.js'

each(
  [
    true,
    { unknown: true },
    { level: true },
    { level: 'unknown' },
    { stack: 'true' },
  ],
  ({ title }, winston) => {
    test(`Option are validated | ${title}`, (t) => {
      t.throws(AnyError.subclass.bind(AnyError, 'OtherError', { winston }))
    })
  },
)

test('Can pass options to static methods', (t) => {
  const error = new TestError('test')
  t.is(
    AnyError.shortFormat({ level: testLevel }).transform(error).level,
    testLevel,
  )
})
