import { setErrorName } from 'error-class-utils'
import errorCustomClass from 'error-custom-class'

import { create } from '../create/main.js'
import { computePluginsOpts } from '../plugins/compute.js'
import { applyPluginsSet } from '../plugins/set.js'

import { normalizeConstructorArgs } from './args.js'
import { mergeCause } from './cause.js'
import { normalize } from './normalize.js'
import { validateClass } from './validate.js'

export const CoreError = errorCustomClass('CoreError')

// Base class for all error classes.
// This is not a global class since it is bound to call-specific plugins.
// Also used to wrap errors without changing their class.
//  - As opposed to exporting a separate class for it since it:
//     - Avoids confusion between both classes
//     - Removes some exports, simplifying the API
// We encourage `instanceof` over `error.name` for checking since this:
//  - Prevents name collisions with other libraries
//  - Allows checking if any error came from a given library
//  - Includes error classes in the exported interface explicitly instead of
//    implicitly, so that users are mindful about breaking changes
//  - Bundles classes with TypeScript documentation, types and autocompletion
//  - Encourages documenting error types
// Checking class with `error.name` is still supported, but not documented
//  - Since it is widely used and can be better in specific cases
// We do not solve name collisions with the following alternatives:
//  - Namespacing all error names with a common prefix since this:
//     - Leads to verbose error names
//     - Requires either an additional option, or guessing ambiguously whether
//       error names are meant to include a namespace prefix
//     - Means special error classes (like `AnyError` or `UnknownError`) might
//       or not be namespaced which might be confusing
//  - Using a separate `namespace` property: this adds too much complexity and
//    is less standard than `instanceof`
export const createAnyError = function ({
  KnownClasses,
  errorData,
  plugins,
  globalOpts,
}) {
  /* eslint-disable fp/no-this */
  class AnyError extends CoreError {
    constructor(message, opts) {
      const isAnyError = new.target === AnyError
      const optsA = normalizeConstructorArgs({
        opts,
        UnknownError: KnownClasses.UnknownError,
        AnyError,
        isAnyError,
      })

      super(message, optsA)

      const { error, cause } = mergeCause(this, isAnyError)
      const ChildError = error.constructor
      validateClass(ChildError, KnownClasses, isAnyError)
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

    static create = create.bind(undefined, {
      globalOpts,
      AnyError,
      KnownClasses,
      errorData,
      plugins,
    })

    static normalize = normalize.bind(undefined, AnyError)
  }
  /* eslint-enable fp/no-this */
  setErrorName(AnyError, 'AnyError')
  return AnyError
}
