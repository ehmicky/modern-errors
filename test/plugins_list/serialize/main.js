import test from 'ava'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import SERIALIZE_PLUGIN from '../../../src/plugins_list/serialize.js'
import { defineClassOpts } from '../../helpers/main.js'

const { TestError, AnyError, UnknownError } = defineClassOpts({}, {}, [
  SERIALIZE_PLUGIN,
])

const testError = new TestError('message')
// eslint-disable-next-line fp/no-mutation
testError.one = true
const errorObject = testError.toJSON()

const nativeError = new TypeError('message')
// eslint-disable-next-line fp/no-mutation
nativeError.one = true
const parentNativeError = new TestError('test')
// eslint-disable-next-line fp/no-mutation
parentNativeError.prop = nativeError
const { prop: nativeErrorObject } = parentNativeError.toJSON()

const convertError = function ({ name, message, stack, one }) {
  return { name, message, stack, one }
}

test('error.toJSON() serializes', (t) => {
  t.deepEqual(errorObject, convertError(testError))
})

each([testError, nativeError], ({ title }, deepError) => {
  test(`error.toJSON() is deep | ${title}`, (t) => {
    const error = new TestError('test')
    error.prop = [deepError]
    t.deepEqual(error.toJSON().prop[0], convertError(deepError))
  })
})

test('error.toJSON() is not enumerable', (t) => {
  t.false(
    Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(Object.getPrototypeOf(testError)),
      'toJSON',
    ).enumerable,
  )
})

test('AnyError.parse() parses error plain objects', (t) => {
  t.deepEqual(AnyError.parse(errorObject), testError)
})

test('AnyError.parse() keeps error class', (t) => {
  t.true(AnyError.parse(errorObject) instanceof TestError)
})

test('AnyError.parse() is deep', (t) => {
  t.deepEqual(AnyError.parse([{ prop: errorObject }])[0].prop, testError)
})

test('AnyError.parse() parses native errors', (t) => {
  const [nativeErrorCopy] = AnyError.parse([nativeErrorObject])
  t.deepEqual(nativeErrorCopy, nativeError)
  t.true(nativeErrorCopy instanceof TypeError)
})

each(
  // eslint-disable-next-line unicorn/no-null
  [undefined, null, true, {}, { name: 'Error' }, testError],
  ({ title }, value) => {
    test(`AnyError.parse() does not normalize top-level non-error plain objects | ${title}`, (t) => {
      t.deepEqual(AnyError.parse(value), value)
    })
  },
)

test('AnyError.parse() normalize top-level native errors', (t) => {
  t.true(AnyError.parse(nativeError) instanceof UnknownError)
})

test('AnyError.parse() does not normalize deep native errors', (t) => {
  t.false(AnyError.parse([nativeError])[0] instanceof UnknownError)
})

test('AnyError.parse() handles constructors that throw', (t) => {
  const InvalidError = AnyError.subclass('InvalidError', {
    custom: class extends AnyError {
      constructor(message, options, prop) {
        if (typeof prop !== 'symbol') {
          throw new TypeError('unsafe')
        }

        super(message, options, prop)
      }
    },
  })
  const invalidError = new InvalidError('message', {}, Symbol('test'))
  t.true(AnyError.parse(invalidError.toJSON()) instanceof UnknownError)
})

test('Serialization keeps constructor arguments', (t) => {
  // eslint-disable-next-line fp/no-let
  let args = []
  const OtherTestError = AnyError.subclass('OtherTestError', {
    custom: class extends AnyError {
      constructor(...constructorArgs) {
        super(...constructorArgs)
        // eslint-disable-next-line fp/no-mutation
        args = constructorArgs
      }
    },
  })
  const cause = new OtherTestError('causeMessage', { one: true }, true)
  const error = new AnyError('message', { cause, two: true })
  AnyError.parse(error.toJSON())
  t.deepEqual(args, ['causeMessage\nmessage', { one: true, two: true }, true])
})
