import { ponyfillCause, ensureCorrectClass } from 'error-class-utils'

import { setAggregateErrors } from './any/aggregate.js'
import { mergeCause } from './any/merge.js'
import { CORE_PLUGINS } from './core_plugins/main.js'
import { computePluginsOpts } from './options/instance.js'
import { setPluginsProperties } from './plugins/properties/main.js'
import { createClass } from './subclass/create.js'
import { classesData, instancesData } from './subclass/map.js'
import { validateSubclass } from './subclass/validate.js'

// Base class for all error classes.
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
// We do not call `Error.captureStackTrace(this, CustomErrorClass)` because:
//  - It is V8 specific
//  - And on V8 (unlike in some browsers like Firefox), `Error.stack`
//    automatically omits the stack lines from custom error constructors
//  - Also, this would force child classes to also use
//    `Error.captureStackTrace()`
/* c8 ignore start */
/* eslint-disable fp/no-this, max-statements, no-constructor-return */
class ModernBaseError extends Error {
  constructor(message, opts) {
    const ErrorClass = new.target
    validateSubclass(ErrorClass)
    const { plugins } = classesData.get(ErrorClass)
    const { nativeOpts, errors, pluginsOpts } = computePluginsOpts(
      ErrorClass,
      plugins,
      opts,
    )

    super(message, nativeOpts)

    ensureCorrectClass(this, ErrorClass)
    ponyfillCause(this, nativeOpts)
    setAggregateErrors(this, errors)

    const error = mergeCause(this, ErrorClass)
    instancesData.set(error, { pluginsOpts })
    setPluginsProperties(error, plugins)

    return error
  }
}
/* eslint-enable fp/no-this, max-statements, no-constructor-return */
/* c8 ignore stop */

const ModernError = createClass({
  ParentError: Error,
  ErrorClass: ModernBaseError,
  parentOpts: {},
  classOpts: {},
  parentPlugins: [],
  plugins: CORE_PLUGINS,
  className: 'ModernError',
})
export default ModernError
