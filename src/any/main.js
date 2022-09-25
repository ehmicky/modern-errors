import { setErrorName } from 'error-class-utils'
import errorCustomClass from 'error-custom-class'

import { computePluginsOpts } from '../plugins/compute.js'
import { applyPluginsSet } from '../plugins/set.js'
import { createSubclass } from '../subclass/main.js'

import { setConstructorArgs } from './args.js'
import { mergeCause } from './cause.js'
import { normalize } from './normalize.js'
import { normalizeOpts } from './options.js'
import { validateSubClass } from './subclass.js'

const CoreError = errorCustomClass('CoreError')

// Base class for all error classes.
// This is not a global class since it is bound to specific plugins, global
// options and `ErrorClasses`.
// This can be also instantiated on its own to wrap errors without changing
// their class, as opposed to exporting a separate class for it since it:
//  - Avoids confusion between both classes
//  - Removes some exports, simplifying the API
// We encourage `instanceof` over `error.name` for checking since this:
//  - Prevents name collisions with other libraries
//  - Allows checking if any error came from a given library
//  - Includes error classes in the exported interface explicitly instead of
//    implicitly, so that users are mindful about breaking changes
//  - Bundles classes with TypeScript documentation, types and autocompletion
//  - Encourages documenting error types
// Checking class with `error.name` is still supported, but not documented
//  - Since it is widely used and can be better in specific cases
//  - It also does not have narrowing with TypeScript
// This also provides with namespacing, i.e. prevents classes of the same name
// but in different libraries to be considered equal. As opposed to the
// following alternatives:
//  - Namespacing all error names with a common prefix since this:
//     - Leads to verbose error names
//     - Requires either an additional option, or guessing ambiguously whether
//       error names are meant to include a namespace prefix
//     - Means special error classes (like `AnyError` or `UnknownError`) might
//       or not be namespaced which might be confusing
//  - Using a separate `namespace` property: this adds too much complexity and
//    is less standard than `instanceof`
export const createAnyError = function ({
  ErrorClasses,
  errorData,
  plugins,
  globalOpts,
}) {
  /* eslint-disable fp/no-this */
  class AnyError extends CoreError {
    constructor(message, opts, ...args) {
      const isAnyError = new.target === AnyError
      validateSubClass(new.target, isAnyError, ErrorClasses)
      const optsA = normalizeOpts({ opts, ErrorClasses, AnyError, isAnyError })

      super(message, optsA)

      const { error, cause } = mergeCause(this, isAnyError)
      const { opts: optsB, pluginsOpts } = computePluginsOpts({
        error,
        opts: optsA,
        cause,
        isAnyError,
        errorData,
        plugins,
      })
      setConstructorArgs({ error, opts: optsB, pluginsOpts, args })
      applyPluginsSet({
        error,
        AnyError,
        ErrorClasses,
        errorData,
        cause,
        plugins,
      })
      /* c8 ignore start */
      // eslint-disable-next-line no-constructor-return
      return error
    }
    /* c8 ignore stop */

    static subclass = createSubclass.bind(undefined, {
      parentOpts: globalOpts,
      ParentError: AnyError,
      ErrorClasses,
      plugins,
    })

    static normalize = normalize.bind(undefined, AnyError)
  }
  /* eslint-enable fp/no-this */
  setErrorName(AnyError, 'AnyError')
  return AnyError
}
