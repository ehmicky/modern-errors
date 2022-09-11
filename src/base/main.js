import { setErrorName } from 'error-class-utils'
import errorCustomClass from 'error-custom-class'

import { computePluginsOpts } from '../plugins/compute.js'
import { applyPluginsSet } from '../plugins/set.js'

import { normalizeConstructorArgs } from './args.js'
import { mergeCause } from './cause.js'
import { addAllInstanceMethods } from './instance.js'
import { validateClass } from './validate.js'

export const CoreError = errorCustomClass('CoreError')

// Base class for all error classes.
// This is not a global class since it is bound to call-specific plugins.
//  - This means the same class cannot be extended twice by `modernErrors()`
//    since this would change its `BaseError`
export const createBaseError = function (state, errorData, plugins) {
  /* eslint-disable fp/no-this */
  class BaseError extends CoreError {
    constructor(message, opts) {
      super(message, opts)

      const optsA = normalizeConstructorArgs(opts)
      const { KnownClasses, AnyError } = state
      const isAnyError = new.target === AnyError
      const { error, cause } = mergeCause(this, isAnyError)
      const ChildError = error.constructor
      validateClass({ ChildError, BaseError, KnownClasses, isAnyError })
      computePluginsOpts({
        error,
        ChildError,
        opts: optsA,
        isAnyError,
        errorData,
        plugins,
      })
      applyPluginsSet({
        error,
        BaseError,
        AnyError,
        KnownClasses,
        errorData,
        cause,
        plugins,
      })
      /* c8 ignore start */
      // eslint-disable-next-line no-constructor-return
      return error
    }
    /* c8 ignore stop */
  }
  /* eslint-enable fp/no-this */
  setErrorName(BaseError, 'BaseError')
  addAllInstanceMethods({ plugins, errorData, BaseError, state })
  return BaseError
}
