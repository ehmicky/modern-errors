import isErrorInstance from 'is-error-instance'
import { format } from 'logform'
import { LEVEL, MESSAGE } from 'triple-beam'

import { toFullLogObject } from './full.js'
import { toShortLogObject } from './short.js'

// Retrieve the Winston formats.
// Those are exposed as static methods, as opposed to using a `log()` instance
// method because:
//  - This allows `exceptionHandlers` to use them
//  - This allows the same error log to use multiple transports using either
//    format
// We do not include any logic that is already available in default formats
// like `json`, `prettyPrint`, `simple` or `cli`.
// We do not allow passing method options to static methods because they would
// have higher priority than instance options, which is unexpected.
const getFormat = function (method, { errorInfo }) {
  return format(formatFunc.bind(undefined, method, errorInfo))()
}

const formatFunc = function (method, errorInfo, value) {
  if (!isErrorInstance(value)) {
    return value
  }

  deleteWinstonProps(value)
  const {
    error,
    showStack,
    options: { level, stack = showStack },
  } = errorInfo(value)
  const object = method({ error, level, stack, errorInfo })
  return { ...object, [LEVEL]: object.level }
}

// Winston directly mutates `log()` argument, which we remove
const deleteWinstonProps = function (value) {
  WINSTON_PROPS.forEach((propName) => {
    // eslint-disable-next-line fp/no-delete, no-param-reassign
    delete value[propName]
  })
}

const WINSTON_PROPS = ['level', LEVEL, MESSAGE]

export const shortFormat = getFormat.bind(undefined, toShortLogObject)
export const fullFormat = getFormat.bind(undefined, toFullLogObject)
