import test from 'ava'
import { each } from 'test-each'

import {
  defineClassOpts,
  defineGlobalOpts,
  createAnyError,
} from '../helpers/main.js'

const { AnyError } = defineClassOpts()

test('plugin.staticMethods are set on AnyError', (t) => {
  t.is(typeof AnyError.getProp, 'function')
})

test('plugin.staticMethods cannot be called before AnyError.subclass()', (t) => {
  const TestAnyError = createAnyError()
  t.throws(TestAnyError.getProp)
})

each(
  [
    'subclass',
    'normalize',
    ...new Set([...Reflect.ownKeys(Error), ...Reflect.ownKeys(Function)]),
  ],
  ({ title }, propName) => {
    test(`plugin.staticMethods cannot redefine native Error.* | ${title}`, (t) => {
      t.throws(
        defineGlobalOpts.bind(undefined, {}, [
          { name: 'one', staticMethods: { [propName]() {} } },
        ]),
      )
    })
  },
)
