import test from 'ava'

// eslint-disable-next-line no-restricted-imports
import WINSTON_PLUGIN from '../../../src/core_plugins/winston/main.js'
import { defineClassOpts } from '../../helpers/main.js'

const { TestError, AnyError } = defineClassOpts({}, {}, [WINSTON_PLUGIN])

test('Sets level to error by default', (t) => {
  const error = new TestError('test')
  t.is(AnyError.shortFormat().transform(error).level, 'error')
})

test('Can sets other level', (t) => {
  const error = new TestError('test', { winston: { level: 'warn' } })
  t.is(AnyError.shortFormat().transform(error).level, 'warn')
})
