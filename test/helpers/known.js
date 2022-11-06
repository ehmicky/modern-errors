import { runInNewContext } from 'node:vm'

import { defineClassesOpts } from './main.js'

export const { ModernError, AnyError, TestError, SiblingError } =
  defineClassesOpts({ TestError: {}, SiblingError: {} })
export const ChildTestError = TestError.subclass('ChildTestError')
export const SpecificErrorClasses = [AnyError, TestError, ChildTestError]
export const KnownErrorClasses = [ModernError, ...SpecificErrorClasses]

export const getUnknownErrors = function () {
  return [...getUnknownErrorInstances(), () => 'message', () => {}]
}

export const getUnknownErrorInstances = function () {
  return [TypeError, Error, runInNewContext('Error')].map(
    (ErrorClass) => () => new ErrorClass('message'),
  )
}
