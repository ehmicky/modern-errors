import { computePluginsOpts } from '../plugins/compute.js'
import { restorePreviousValues, restoreNewValues } from '../plugins/previous.js'
import { setPluginsProperties } from '../plugins/properties.js'

import { setAggregateErrors } from './aggregate.js'
import { getConstructorArgs, setConstructorArgs } from './args.js'
import { getCause, mergeCause } from './cause.js'
import { getUnknownDeep } from './deep.js'

// Merge `error.cause` and set `plugin.properties()`.
// Also compute and keep track of instance options and `constructorArgs`.
export const modifyError = function ({
  currentError,
  opts,
  args,
  ErrorClasses,
  errorData,
  plugins,
  AnyError,
  isAnyError,
}) {
  const cause = getCause(currentError, AnyError)
  restorePreviousValues(cause, errorData)
  const error = applyErrorLogic({
    currentError,
    cause,
    opts,
    args,
    ErrorClasses,
    errorData,
    plugins,
    AnyError,
    isAnyError,
  })
  restoreNewValues(cause, errorData, isAnyError)
  return error
}

const applyErrorLogic = function ({
  currentError,
  cause,
  opts,
  args,
  ErrorClasses,
  errorData,
  plugins,
  AnyError,
  isAnyError,
}) {
  const unknownDeep = getUnknownDeep({
    cause,
    AnyError,
    ErrorClasses,
    errorData,
  })
  const { opts: optsA, pluginsOpts } = computePluginsOpts({
    opts,
    cause,
    isAnyError,
    errorData,
    plugins,
  })
  const constructorArgs = getConstructorArgs({
    opts: optsA,
    cause,
    isAnyError,
    pluginsOpts,
    args,
  })
  setAggregateErrors(currentError, optsA, AnyError)
  const error = mergeCause(currentError, isAnyError)
  setConstructorArgs(error, constructorArgs)
  const { previousValues, newValues } = setPluginsProperties({
    error,
    AnyError,
    ErrorClasses,
    unknownDeep,
    plugins,
    pluginsOpts,
  })
  errorData.set(error, { unknownDeep, pluginsOpts, previousValues, newValues })
  return error
}
