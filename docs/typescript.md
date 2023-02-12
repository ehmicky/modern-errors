# TypeScript

The [API](../README.md#api) is fully typed for TypeScript users
([>= 4.7](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7)).

Since this package is an ES module, TypeScript must be configured to
[output ES modules](https://www.typescriptlang.org/docs/handbook/esm-node.html),
not CommonJS.

## Error properties and methods

Error [classes'](../README.md#%EF%B8%8F-error-classes) and
[instances'](../README.md#throw-errors)
[`props`](../README.md#%EF%B8%8F-error-properties), aggregate
[`errors`](../README.md#aggregate-errors) and
[`custom`](../README.md#-custom-logic) methods/properties are typed.

<!-- eslint-disable class-methods-use-this -->

```ts
const BaseError = ModernError.subclass('BaseError', {
  props: { userId: 5 as const },
  custom: class extends ModernError {
    isUserInput() {
      return true as const
    }
  },
})
const error = new BaseError('Wrong user name', {
  props: { userName: 'Alice' as const },
})
const { userId, userName } = error // Inferred type: `5` and `"Alice"`
const result = error.isUserInput() // Inferred type: `true`
```

Error `props` without default values can also be typed.

```ts
const BaseError = ModernError.subclass('BaseError', {
  props: {} as { userId: number },
})

type UserId = InstanceType<typeof BaseError>['userId'] // Type: `number`
```

## Custom options

[`custom`](../README.md#-custom-logic) options can be typed.

<!-- eslint-disable no-param-reassign, fp/no-mutation -->

```ts
import type { InstanceOptions } from 'modern-errors'

interface InputErrorOptions {
  suffix?: string
}

export const InputError = BaseError.subclass('InputError', {
  custom: class extends BaseError {
    constructor(
      message: string,
      options?: InstanceOptions & InputErrorOptions,
    ) {
      message += options?.suffix ?? ''
      super(message, options)
    }
  },
})

// Type error: `suffix` must be a string
const error = new InputError('Wrong user name', { suffix: true })
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

<!-- eslint-disable max-depth -->

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
type AnyErrorClass = ReturnType<typeof BaseError.subclass>

const InputError = BaseError.subclass('InputError')
type InputErrorClass = typeof InputError

type InputErrorInstance = InstanceType<InputErrorClass>

const printErrorClass = (ErrorClass: AnyErrorClass) => {
  // ...
}

const printInputErrorClass = (InputErrorClass: InputErrorClass) => {
  // ...
}

const logInputError = (inputError: InputErrorInstance) => {
  // ...
}

printErrorClass(InputError)
printInputErrorClass(InputError)
logInputError(new InputError('Wrong user name'))
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
[`props`](../README.md#%EF%B8%8F-error-properties), aggregate
[`errors`](../README.md#aggregate-errors) nor
[`custom`](../README.md#-custom-logic) methods/properties. However, they can
include specific plugins' methods, properties and options by passing those as a
generic parameter, such as `ErrorClass<[typeof plugin]>`.

They should only be used to type unknown error instances and classes, when no
variable nor [type inference](#type-inference) is available. For example, they
can be useful when [creating plugins](plugins.md#typescript).
