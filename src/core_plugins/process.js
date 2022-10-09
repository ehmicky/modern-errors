import isPlainObj from 'is-plain-obj'
import logProcessErrors from 'log-process-errors'

const logProcess = function ({
  options,
  AnyError,
  ErrorClasses: { UnknownError },
}) {
  return logProcessErrors(getOptions(options, AnyError, UnknownError))
}

const getOptions = function (options, AnyError, UnknownError) {
  if (!isPlainObj(options)) {
    throw new TypeError('It must be a plain object.')
  }

  const { exit, onError = defaultOnError, ...unknownOpts } = options
  validateOpts(onError, unknownOpts)
  const onErrorA = customOnError.bind(undefined, {
    onError,
    AnyError,
    UnknownError,
  })
  return { exit, onError: onErrorA }
}

const defaultOnError = function (error) {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(error)
}

const validateOpts = function (onError, unknownOpts) {
  const [unknownOpt] = Object.keys(unknownOpts)

  if (unknownOpt !== undefined) {
    throw new TypeError(`Unknown option "${unknownOpt}".`)
  }

  if (typeof onError !== 'function') {
    throw new TypeError(`Option "onError" must be a function: ${onError}.`)
  }
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
  staticMethods: { logProcess },
}
