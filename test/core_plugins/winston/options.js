import test from 'ava'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import WINSTON_PLUGIN from '../../../src/core_plugins/winston/main.js'
import { defineClassOpts } from '../../helpers/main.js'

const { TestError, AnyError } = defineClassOpts({}, {}, [WINSTON_PLUGIN])

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

test('Cannot pass options to static methods', (t) => {
  const error = new TestError('test')
  t.is(AnyError.shortFormat({ level: 'warn' }).transform(error).level, 'error')
})
