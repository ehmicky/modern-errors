import { runInNewContext } from 'node:vm'

export const getUnknownErrors = () => [
  ...getUnknownErrorInstances(),
  () => 'message',
  () => {},
]

export const getUnknownErrorInstances = () =>
  [TypeError, Error, runInNewContext('Error')].map(
    (ErrorClass) => () => new ErrorClass('message'),
  )
