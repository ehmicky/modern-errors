import { runInNewContext } from 'vm'

import { defineClassOpts } from './main.js'

export const { TestError, UnknownError, AnyError } = defineClassOpts()

const ChildTestError = TestError.subclass('ChildTestError')
export const KnownErrorClasses = [TestError, ChildTestError]

export const getKnownErrors = function () {
  return KnownErrorClasses.map(getBoundError)
}

const ChildUnknownError = UnknownError.subclass('ChildUnknownError')
export const UnknownErrorClasses = [UnknownError, ChildUnknownError]

export const getUnknownErrors = function () {
  return UnknownErrorClasses.map(getBoundError)
}

export const getNativeErrors = function () {
  return [...getNativeErrorInstances(), () => 'message', () => {}]
}

export const getNativeErrorInstances = function () {
  return [TypeError, Error, runInNewContext('Error')].map(getBoundError)
}

const getBoundError = function (ErrorClass) {
  return getError.bind(undefined, ErrorClass)
}

const getError = function (ErrorClass) {
  return new ErrorClass('message')
}
