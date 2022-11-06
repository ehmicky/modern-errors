import { ponyfillCause, ensureCorrectClass } from 'error-class-utils'

import { setAggregateErrors } from './any/aggregate.js'
import { setConstructorArgs } from './any/args.js'
import { mergeCause } from './any/merge.js'
import { normalizeOpts } from './any/options.js'
import { validateSubclass } from './any/subclass.js'
import { CORE_PLUGINS } from './core_plugins/main.js'
import { computePluginsOpts } from './options/instance.js'
import { setPluginsProperties } from './plugins/properties/main.js'
import { createClass } from './subclass/main.js'
// eslint-disable-next-line import/max-dependencies
import { classesData, instancesData } from './subclass/map.js'

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
/* eslint-disable fp/no-this */
class ModernBaseError extends Error {
  constructor(message, opts, ...args) {
    const ErrorClass = new.target
    validateSubclass(ErrorClass)
    const optsA = normalizeOpts(ErrorClass, opts)
    super(message, optsA)
    ensureCorrectClass(this, ErrorClass)
    ponyfillCause(this, optsA)
    /* c8 ignore start */
    // eslint-disable-next-line no-constructor-return
    return modifyError({ currentError: this, opts: optsA, args, ErrorClass })
  }
  /* c8 ignore stop */
}

const modifyError = function ({ currentError, opts, args, ErrorClass }) {
  const { plugins } = classesData.get(ErrorClass)
  const { opts: optsA, pluginsOpts } = computePluginsOpts(plugins, opts)
  setAggregateErrors(currentError, optsA)
  const error = mergeCause(currentError, ErrorClass)
  instancesData.set(error, { pluginsOpts })
  setConstructorArgs({ error, opts: optsA, pluginsOpts, args })
  setPluginsProperties(error, plugins)
  return error
}

/* eslint-enable fp/no-this */
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
