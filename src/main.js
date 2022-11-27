import errorCustomClass from 'error-custom-class'

import { setAggregateErrors } from './merge/aggregate.js'
import { mergeCause } from './merge/cause.js'
import { computePluginsOpts } from './options/instance.js'
import { CORE_PLUGINS } from './plugins/core/main.js'
import { setPluginsProperties } from './plugins/properties/main.js'
import { createClass } from './subclass/create/main.js'
import { classesData, instancesData } from './subclass/map.js'
import { validateSubclass } from './subclass/validate.js'

const BaseModernError = errorCustomClass('BaseModernError')

// Base class for all error classes.
// We do not call `Error.captureStackTrace(this, CustomErrorClass)` because:
//  - It is V8 specific
//  - And on V8 (unlike in some browsers like Firefox), `Error.stack`
//    automatically omits the stack lines from custom error constructors
//  - Also, this would force child classes to also use
//    `Error.captureStackTrace()`
/* c8 ignore start */
/* eslint-disable fp/no-this, no-constructor-return */
class CustomModernError extends BaseModernError {
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

    setAggregateErrors(this, errors)
    const error = mergeCause(this, ErrorClass)
    instancesData.set(error, { pluginsOpts })
    setPluginsProperties(error, plugins)

    return error
  }
}
/* eslint-enable fp/no-this, no-constructor-return */
/* c8 ignore stop */

const ModernError = createClass({
  ParentError: Error,
  ErrorClass: CustomModernError,
  parentOpts: {},
  classOpts: {},
  parentPlugins: [],
  plugins: CORE_PLUGINS,
  className: 'ModernError',
})
export default ModernError
