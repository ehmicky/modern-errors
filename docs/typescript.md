# TypeScript

The [API](../README.md#api) is fully typed for TypeScript users
([>= 4.7](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7)).

## Error properties and methods

Error [classes'](../README.md#%EF%B8%8F-error-classes) and
[instances'](../README.md#throw-errors)
[`props`](../README.md#error-instance-properties), aggregate
[`errors`](../README.md#aggregate-errors) and
[`custom`](../README.md#-custom-logic) methods/properties are typed.

```ts
const BaseError = ModernError.subclass('BaseError', {
  custom: class extends ModernError {
    isUserInput() {
      return true as const
    }
  },
})
const error = new BaseError('Wrong user name', {
  props: { userId: 5 as const },
})
const { userId } = error // Inferred type: `5`
const result = error.isUserInput() // Inferred type: `true`
```

## Plugins

Plugin [methods](plugins.md#staticmethodsmethodname),
[properties](plugins.md#properties) and [options](../README.md#plugin-options)
are typed.

```ts
import ModernError from 'modern-errors'

// This plugin adds a `BaseError.httpResponse(error)` method
import modernErrorsHttp from 'modern-errors-http'

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsHttp],
})

const error = new BaseError('Wrong user name', {
  http: { title: false }, // Type error: `title` must be a string
})
const httpResponse = BaseError.httpResponse(error) // Inferred type: response object
```

## Narrowing

When catching exceptions, their type can be
[narrowed](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#instanceof-narrowing)
using [`instanceof`](../README.md#check-error-classes).

```ts
const InputError = BaseError.subclass('InputError', {
  props: { isUserError: true as const },
})

try {
  // ...
} catch (error) {
  // Narrows `error` type to `InputError`
  if (error instanceof InputError) {
    const { isUserError } = error // Inferred type: `true`
  }
}
```

## Type inference

Types are automatically inferred: no explicit type declaration is needed.
[`typeof`](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html),
[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype),
etc. can be used to retrieve the type of a variable or method.

```ts
const printErrorClass = function (
  ErrorClass: ReturnType<typeof BaseError.subclass>,
) {
  // ...
}

const InputError = BaseError.subclass('InputError')
printErrorClass(InputError)
```

## Wide types

The following types are exported:
[`ErrorInstance`](../README.md#new-errorclassmessage-options),
[`ErrorClass`](../README.md#%EF%B8%8F-error-classes),
[`ClassOptions`](../README.md#options),
[`InstanceOptions`](../README.md#options-2),
[`MethodOptions`](../README.md#plugin-options),
[`Plugin`](../README.md#-plugins) and [`Info`](plugins.md#info-1).

Those types are wide: they do not include any information about specific
[`props`](../README.md#error-instance-properties), aggregate
[`errors`](../README.md#aggregate-errors) nor
[`custom`](../README.md#-custom-logic) methods/properties. However, they can
include specific plugins' methods, properties and options by passing those as a
generic parameter, such as `ErrorClass<[typeof plugin]>`.

They should only be used to type unknown error instances and classes, when no
variable nor [type inference](#type-inference) is available. For example, they
can be useful when [creating plugins](plugins.md#typescript).
