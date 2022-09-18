import { setErrorName } from 'error-class-utils'

// Create `AnyError` class, used to wrap errors without changing their class
export const createAnyError = function (BaseError) {
  class AnyError extends BaseError {
    static [Symbol.hasInstance] = hasKnownClass.bind(undefined, BaseError)
  }
  setErrorName(AnyError, 'AnyError')
  return AnyError
}

// We proxy `instanceof AnyError` to `instanceof BaseError` since `BaseError`
// is not exposed.
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
const hasKnownClass = function (BaseError, value) {
  return value instanceof BaseError
}
