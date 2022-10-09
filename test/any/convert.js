import { runInNewContext } from 'vm'

import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from '../helpers/main.js'

const { TestError, UnknownError, AnyError } = defineClassOpts()
const ChildTestError = TestError.subclass('ChildTestError')
const ChildUnknownError = UnknownError.subclass('ChildUnknownError')
const KnownErrorClasses = [TestError, ChildTestError]
const UnknownErrorClasses = [UnknownError, ChildUnknownError]

const getKnownErrors = function () {
  return [...KnownErrorClasses, ...UnknownErrorClasses].map(getKnownError)
}

const getKnownError = function (ErrorClass) {
  return new ErrorClass('message')
}

const getUnknownErrors = function () {
  return [...getUnknownErrorInstances(), 'message', undefined]
}

const getUnknownErrorInstances = function () {
  const OtherError = runInNewContext('Error')
  return [
    new TypeError('message'),
    new Error('message'),
    new OtherError('message'),
  ]
}

const assertInstanceOf = function (t, error, ErrorClass) {
  t.true(error instanceof ErrorClass)
  t.is(Object.getPrototypeOf(error), ErrorClass.prototype)
  t.is(error.name, ErrorClass.name)
}

each(getKnownErrors(), ({ title }, cause) => {
  test(`AnyError with known cause uses child class | ${title}`, (t) => {
    const error = new AnyError('message', { cause })
    assertInstanceOf(t, error, cause.constructor)
  })
})

each(getUnknownErrors(), ({ title }, cause) => {
  test(`AnyError with unknown cause uses UnknownError | ${title}`, (t) => {
    const error = new AnyError('message', { cause })
    assertInstanceOf(t, error, UnknownError)
  })
})

each(
  [...KnownErrorClasses, ...UnknownErrorClasses],
  [...getKnownErrors(), ...getUnknownErrors()],
  ({ title }, ErrorClass, cause) => {
    test(`Known class with known or unknown cause uses parent class | ${title}`, (t) => {
      const error = new ErrorClass('message', { cause })
      assertInstanceOf(t, error, ErrorClass)
    })
  },
)

each(
  [AnyError, ...KnownErrorClasses, ...UnknownErrorClasses],
  [
    () => 'message',
    // eslint-disable-next-line fp/no-mutating-assign
    () => Object.assign(new TypeError('message'), { name: true }),
    // eslint-disable-next-line fp/no-mutating-assign
    () => Object.assign(new TestError('message'), { name: true }),
    () => new Error('message'),
    () => new TypeError('message'),
    () => new UnknownError('message'),
  ],
  ({ title }, ParentErrorClass, getCause) => {
    test(`Cause without an error name ignores it | ${title}`, (t) => {
      t.is(new ParentErrorClass('', { cause: getCause() }).message, 'message')
    })
  },
)

each(
  [AnyError, ...KnownErrorClasses, ...UnknownErrorClasses],
  getUnknownErrorInstances(),
  ['', 'test: '],
  // eslint-disable-next-line max-params
  ({ title }, ParentErrorClass, error, message) => {
    test(`Unknown cause name is kept | ${title}`, (t) => {
      error.name = 'NamedError'
      t.is(
        new ParentErrorClass(message, { cause: error }).message,
        `${message}${error.name}: ${error.message}`,
      )
    })
  },
)

each(UnknownErrorClasses, ({ title }, ErrorClass) => {
  test(`Known cause name is kept with UnknownError and empty message | ${title}`, (t) => {
    const cause = new TestError('message')
    t.is(
      new ErrorClass('', { cause }).message,
      `${cause.name}: ${cause.message}`,
    )
  })
})

each(
  UnknownErrorClasses,
  getKnownErrors(),
  ({ title }, ParentErrorClass, cause) => {
    test(`Known cause name is ignored with UnknownError and non-empty message | ${title}`, (t) => {
      const parentMessage = 'parentMessage'
      t.is(
        new ParentErrorClass(parentMessage, { cause }).message,
        `${cause.message}\n${parentMessage}`,
      )
    })
  },
)

each([AnyError, ...KnownErrorClasses], ({ title }, ErrorClass) => {
  test(`Known cause name is ignored without UnknownError | ${title}`, (t) => {
    const cause = new TestError('message')
    t.is(new ErrorClass('', { cause }).message, cause.message)
  })
})
