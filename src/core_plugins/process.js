import isPlainObj from 'is-plain-obj'
import logProcessErrors from 'log-process-errors'

const logProcess = function ({ options }) {
  return logProcessErrors(getOptions(options))
}

const getOptions = function (options) {
  if (!isPlainObj(options)) {
    throw new Error('It must be a plain object.')
  }

  const { exit, onError, ...unknownOpts } = options
  validateOpts(onError, unknownOpts)
  const onErrorA = customOnError.bind(undefined, onError)
  return { exit, onError: onErrorA }
}

const validateOpts = function (onError, unknownOpts) {
  const [unknownOpt] = Object.keys(unknownOpts)

  if (unknownOpt !== undefined) {
    throw new Error(`Unknown option "${unknownOpt}".`)
  }

  if (onError !== undefined && typeof onError !== 'function') {
    throw new Error(`Option "onError" must be a function: ${onError}.`)
  }
}

const customOnError = async function (onError, ...args) {
  await onError(...args)
}

// eslint-disable-next-line import/no-default-export
export default {
  name: 'process',
  staticMethods: { logProcess },
}
