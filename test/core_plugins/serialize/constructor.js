import test from 'ava'

import { AnyError, UnknownError } from '../../helpers/serialize.js'

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
