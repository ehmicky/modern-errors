import { runInNewContext } from 'vm'

import { defineClassOpts } from './main.js'

export const { TestError, UnknownError, AnyError } = defineClassOpts()
const ChildTestError = TestError.subclass('ChildTestError')
const ChildUnknownError = UnknownError.subclass('ChildUnknownError')

export const KnownErrorClasses = [TestError, ChildTestError]
export const UnknownErrorClasses = [UnknownError, ChildUnknownError]

export const getKnownErrors = function () {
  return [...KnownErrorClasses, ...UnknownErrorClasses].map(getKnownError)
}

const getKnownError = function (ErrorClass) {
  return new ErrorClass('message')
}

export const getUnknownErrors = function () {
  return [...getUnknownErrorInstances(), 'message', undefined]
}

export const getUnknownErrorInstances = function () {
  const OtherError = runInNewContext('Error')
  return [
    new TypeError('message'),
    new Error('message'),
    new OtherError('message'),
  ]
}
