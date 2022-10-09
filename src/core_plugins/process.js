import logProcessErrors, { validateOptions } from 'log-process-errors'

const getOptions = function (options) {
  validateOptions(options)
  return options
}

// Forwards to `log-process-errors`
const logProcess = function ({
  options = {},
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
  { onError = defaultOnError, AnyError, UnknownError },
  error,
  ...args
) {
  const unknownError = normalizeError(error, AnyError, UnknownError)
  await onError(unknownError, ...args)
}

// Same default `onError` as `log-process-errors`
const defaultOnError = function (error) {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(error)
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
