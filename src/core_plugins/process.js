import isPlainObj from 'is-plain-obj'
import logProcessErrors from 'log-process-errors'

// Options are forwarded to `log-process-errors`
const getOptions = function (options = {}) {
  if (!isPlainObj(options)) {
    throw new TypeError('It must be a plain object.')
  }

  return normalizeOpts(options)
}

// Same validation as `log-process-errors`
const normalizeOpts = function ({
  exit,
  onError = defaultOnError,
  ...unknownOpts
}) {
  validateExit(exit)
  validateOnError(onError)
  validateUnknown(unknownOpts)
  return { exit, onError }
}

// Same default `onError` as `log-process-errors`
const defaultOnError = function (error) {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(error)
}

const validateExit = function (exit) {
  if (exit !== undefined && typeof exit !== 'boolean') {
    throw new TypeError(`Option "exit" must be a boolean: ${exit}.`)
  }
}

const validateOnError = function (onError) {
  if (typeof onError !== 'function') {
    throw new TypeError(`Option "onError" must be a function: ${onError}.`)
  }
}

const validateUnknown = function (unknownOpts) {
  const [unknownOpt] = Object.keys(unknownOpts)

  if (unknownOpt !== undefined) {
    throw new TypeError(`Unknown option "${unknownOpt}".`)
  }
}

// Forwards to `log-process-errors`
const logProcess = function ({
  options,
  AnyError,
  ErrorClasses: { UnknownError },
}) {
  const onError = customOnError.bind(undefined, {
    onError: options.onError,
    AnyError,
    UnknownError,
  })
  return logProcessErrors({ ...options, onError })
}

// Process errors always indicate unknown behavior. Therefore, we wrap them
// as `UnknownError` even if the underlying class is known.
// This applies whether `onError` is overridden or not.
const customOnError = async function (
  { onError, AnyError, UnknownError },
  error,
  ...args
) {
  const unknownError = normalizeError(error, AnyError, UnknownError)
  await onError(unknownError, ...args)
}

const normalizeError = function (error, AnyError, UnknownError) {
  const cause = AnyError.normalize(error)
  return cause instanceof UnknownError ? cause : new UnknownError('', { cause })
}

// eslint-disable-next-line import/no-default-export
export default {
  name: 'process',
  getOptions,
  staticMethods: { logProcess },
}
