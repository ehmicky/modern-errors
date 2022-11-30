import { runInNewContext } from 'node:vm'

export const getUnknownErrors = function () {
  return [...getUnknownErrorInstances(), () => 'message', () => {}]
}

export const getUnknownErrorInstances = function () {
  return [TypeError, Error, runInNewContext('Error')].map(
    (ErrorClass) => () => new ErrorClass('message'),
  )
}
