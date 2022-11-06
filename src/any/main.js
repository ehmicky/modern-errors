import errorCustomClass from 'error-custom-class'

import { validateGlobalOpts } from '../options/class.js'
import { computePluginsOpts } from '../options/instance.js'
import { setPluginsProperties } from '../plugins/properties/main.js'
import { createSubclass } from '../subclass/main.js'
import { ERROR_INSTANCES } from '../subclass/map.js'

import { setAggregateErrors } from './aggregate.js'
import { setConstructorArgs } from './args.js'
import { mergeCause } from './merge.js'
import { normalizeOpts } from './options.js'
// eslint-disable-next-line import/max-dependencies
import { validateSubclass } from './subclass.js'

const CoreError = errorCustomClass('CoreError')

// Base class for all error classes.
// This is not a global class since it is bound to specific plugins, global
// options and `ErrorClasses`.
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
//  - Using a separate `namespace` property: this adds too much complexity and
//    is less standard than `instanceof`
export const createAnyError = function (plugins, globalOpts) {
  validateGlobalOpts(globalOpts)
  const AnyError = getAnyError(plugins)
  return createSubclass({
    ErrorClass: AnyError,
    className: 'AnyError',
    parentOpts: {},
    classOpts: globalOpts,
    plugins,
  })
}

const getAnyError = function (plugins) {
  /* eslint-disable fp/no-this */
  return class AnyError extends CoreError {
    constructor(message, opts, ...args) {
      const ErrorClass = new.target
      validateSubclass(ErrorClass)
      const optsA = normalizeOpts(ErrorClass, opts)
      super(message, optsA)
      /* c8 ignore start */
      // eslint-disable-next-line no-constructor-return
      return modifyError({
        currentError: this,
        opts: optsA,
        args,
        ErrorClass,
        plugins,
      })
    }
    /* c8 ignore stop */
  }
  /* eslint-enable fp/no-this */
}

const modifyError = function ({
  currentError,
  opts,
  args,
  ErrorClass,
  plugins,
}) {
  const { opts: optsA, pluginsOpts } = computePluginsOpts(plugins, opts)
  setAggregateErrors(currentError, optsA)
  const error = mergeCause(currentError, ErrorClass)
  ERROR_INSTANCES.set(error, { pluginsOpts })
  setConstructorArgs({ error, opts: optsA, pluginsOpts, args })
  setPluginsProperties(error, plugins)
  return error
}
