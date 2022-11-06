import { computePluginsOpts } from '../options/instance.js'
import { setPluginsProperties } from '../plugins/properties/main.js'
import {
  restorePreviousValues,
  restoreNewValues,
} from '../plugins/properties/previous.js'

import { setAggregateErrors, normalizeAggregateErrors } from './aggregate.js'
import { getConstructorArgs, setConstructorArgs } from './args.js'
import { getCause, mergeCause } from './merge.js'

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
  setAggregateErrors(currentError, optsA)
  const error = mergeCause(currentError, isAnyError)
  normalizeAggregateErrors(error, AnyError)
  setConstructorArgs(error, constructorArgs)
  errorData.set(error, { pluginsOpts, previousValues: [], newValues: [] })
  const { previousValues, newValues } = setPluginsProperties({
    error,
    AnyError,
    ErrorClasses,
    errorData,
    plugins,
  })
  errorData.set(error, { pluginsOpts, previousValues, newValues })
  return error
}
