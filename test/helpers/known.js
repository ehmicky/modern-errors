import { runInNewContext } from 'node:vm'

import { defineClassOpts } from './main.js'

export const { TestError, AnyError } = defineClassOpts()
export const ChildTestError = TestError.subclass('ChildTestError')
export const KnownErrorClasses = [AnyError, TestError, ChildTestError]

export const getKnownErrors = function () {
  return KnownErrorClasses.map(getBoundError)
}

export const getUnknownErrors = function () {
  return [...getUnknownErrorInstances(), () => 'message', () => {}]
}

export const getUnknownErrorInstances = function () {
  return [TypeError, Error, runInNewContext('Error')].map(getBoundError)
}

const getBoundError = function (ErrorClass) {
  return getError.bind(undefined, ErrorClass)
}

const getError = function (ErrorClass) {
  return new ErrorClass('message')
}
