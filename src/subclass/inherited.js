import { setNonEnumProp } from '../utils/descriptors.js'

// We do not pass `ErrorClass` to plugins' `staticMethods` because:
//  - If the constructor is `custom`, it cannot be called safely since its
//    signature is not known
//  - This might encourage plugins to use `ErrorClass` static properties instead
//    of options
// We enforce static methods to be called on `AnyError.*` instead of
// `ErrorClass.*`:
//  - `ErrorClass.*` static methods are not useful since plugin arguments are
//    not class-specific, i.e. behaves like `AnyError.*`
// Therefore, we do not pass class `options` either
//  - Also, they could be used by plugins to retrieve `ErrorClass` through
//    `ErrorClasses`, which we discourage
// Also, there is no reason for `ErrorClass.normalize()` to behave differently
// from `AnyError.normalize()`
//  - As opposed to normalizing errors to `ErrorClass` instead of `UnknownError`
//  - Because:
//     - Custom constructors might throw
//     - It should not be needed:
//        - If `try`/`catch` blocks are wrapping every known error, then any
//          other error should be normalized to `UnknownError`
//        - I.e. having to set a specific `ErrorClass` to unknown errors
//          indicates that `try`/`catch` blocks are too wide
//     - It is easy to achieve using:
//         cause instanceof AnyError ? cause : new ErrorClass('', { cause })
// For the reasons above, we throw when calling `ErrorClass.*` instead of
// `AnyError.*`
// We also do not allow `custom` classes to override `AnyError.*` since:
//  - Those have core meaning (`*Error.subclass()`)
//  - Or might have in the future
export const setInheritedMethods = function ({
  ErrorClass,
  custom,
  plugins,
  className,
}) {
  const inheritedMethods = getInheritedMethods(plugins)
  inheritedMethods.forEach((inheritedMethod) => {
    setInheritedMethod({ ErrorClass, custom, inheritedMethod, className })
  })
}

const getInheritedMethods = function (plugins) {
  return [
    ...new Set([
      ...ANY_ERROR_STATIC_METHODS,
      ...plugins.flatMap(getPluginStaticMethods),
    ]),
  ]
}

export const ANY_ERROR_STATIC_METHODS = ['subclass', 'normalize']

const getPluginStaticMethods = function ({ staticMethods }) {
  return Object.keys(staticMethods)
}

const setInheritedMethod = function ({
  ErrorClass,
  custom,
  inheritedMethod,
  className,
}) {
  if (custom !== undefined && hasOwn.call(custom, inheritedMethod)) {
    throw new TypeError(
      `Invalid "custom" option for "${className}": "${inheritedMethod}()" must not be defined because "AnyError.${inheritedMethod}()" already exists.`,
    )
  }

  setNonEnumProp(
    ErrorClass,
    inheritedMethod,
    throwOnInheritedMethod.bind(undefined, inheritedMethod, className),
  )
}

const { hasOwnProperty: hasOwn } = Object.prototype

const throwOnInheritedMethod = function (inheritedMethod, className) {
  throw new TypeError(
    `"AnyError.${inheritedMethod}()" must be called instead of "${className}.${inheritedMethod}()".`,
  )
}
