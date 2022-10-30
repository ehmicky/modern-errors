# Creating a plugin

This document explains how to create a plugin for `modern-errors`. To learn how
to [install](../README.md#adding-plugins), [use](../README.md#adding-plugins)
and [configure](../README.md#plugin-options) plugins, please refer to the
[main documentation](../README.md#plugins-1) instead.

## Features

Plugins can add:

- Error [properties](#properties): `error.message`, `error.stack` or any other
  `error.*`
- Error [instance methods](#instancemethodsmethodname): `error.exampleMethod()`
- [`AnyError`](../README.md#anyerror)
  [static methods](#staticmethodsmethodname): `AnyError.exampleMethod()`

## Examples

[Existing plugins](../README.md#plugins) can be used for inspiration.

## API

Plugins are plain objects with a
[default export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).
All members are optional except for [`name`](#name).

```js
export default {
  // Name used to configure the plugin
  name: 'example',

  // Set error properties
  properties() {},

  // Add error instance methods like `error.exampleMethod()`
  instanceMethods: {
    exampleMethod() {},
  },

  // Add `AnyError` static methods like `AnyError.staticMethod()`
  staticMethods: {
    staticMethod() {},
  },

  // Validate and normalize options
  getOptions() {},

  // Determine if a value is plugin's options
  isOptions() {},
}
```

### name

_Type_: `string`

Plugin's name. It is used to [configure](../README.md#plugin-options) the
plugin's options.

Only lowercase letters must be used (as opposed to `_` `-` `.` or uppercase
letters).

```js
// Users configure this plugin using `modernErrors([plugin], { example: ... })`
export default {
  name: 'example',
}
```

### properties

_Type_: `(info) => object`

Set properties on `error.*` (including `message` or `stack`). The properties to
set must be returned as an object.

```js
export default {
  name: 'example',
  // Sets `error.example: true`
  properties() {
    return { example: true }
  },
}
```

### instanceMethods.{methodName}

_Type_: `(info, ...args) => any`

Add error instance methods like `error.methodName(...args)`.

The first argument [`info`](#info) is provided by `modern-errors`. The other
`...args` are forwarded from the method's call.

If the logic involves an `error` instance or error-specific `options`, instance
methods should be preferred over [static methods](#staticmethodsmethodname).
Otherwise, static methods should be used.

```js
export default {
  name: 'example',
  // `error.concatMessage("one")` returns `${error.message} - one`
  instanceMethods: {
    concatMessage({ error }, string) {
      return `${error.message} - ${string}`
    },
  },
}
```

### staticMethods.{methodName}

_Type_: `(info, ...args) => any`

Add [`AnyError`](../README.md#anyerror) static methods like
`AnyError.methodName(...args)`.

The first argument [`info`](#info) is provided by `modern-errors`. The other
`...args` are forwarded from the method's call.

```js
export default {
  name: 'example',
  // `AnyError.multiply(2, 3)` returns `6`
  staticMethods: {
    multiply(info, first, second) {
      return first * second
    },
  },
}
```

### getOptions

_Type_: `(options, full) => options`

Normalize and return the [plugin's `options`](../README.md#plugin-options).
Required to use plugin `options`.

If `options` are invalid, an `Error` should be thrown. The error message is
automatically prepended with `Invalid "${plugin.name}" options:`. Regular
[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)s
should be thrown, as opposed to using `modern-errors` itself.

The plugin's `options` can have any type.

<!-- eslint-disable unicorn/prefer-type-error -->

```js
export default {
  name: 'example',
  getOptions(options = true) {
    if (typeof options !== 'boolean') {
      throw new Error('It must be true or false.')
    }

    return options
  },
}
```

#### full

Plugin users can pass additional `options`
[at multiple stages](../README.md#plugin-options). Each stage calls
`getOptions()`.

- When error classes are defined:
  [`modernErrors(plugins, options)`](../README.md#modernerrorsplugins-options)
  and
  [`AnyError.subclass('ErrorClass', options)`](../README.md#anyerrorsubclassname-options)
- When new errors are created:
  [`new ErrorClass('message', options)`](../README.md#simple-errors)
- As a last argument to [instance methods](#instancemethodsmethodname) or
  [static methods](#staticmethodsmethodname)

`full` is a boolean parameter indicating whether the `options` might still be
partial. It is `false` in the first stage above, `true` in the others.

When `full` is `false`, any logic validating required properties should be
skipped. The same applies to properties depending on each other.

<!-- eslint-disable unicorn/prefer-type-error, complexity -->

```js
export default {
  name: 'example',
  getOptions(options, full) {
    if (typeof options !== 'object' || options === null) {
      throw new Error('It must be a plain object.')
    }

    if (full && options.apiKey === undefined) {
      throw new Error('"apiKey" is required.')
    }

    return options
  },
}
```

### isOptions

_Type_: `(options) => boolean`

Plugin users [can pass](../README.md#plugin-options) the plugin's `options` as
the last argument of any plugin method ([instance](#instancemethodsmethodname)
or [static](#staticmethodsmethodname)). `isOptions()` determines whether the
last argument of a plugin method are `options` or not. This should be defined if
the plugin has any method with arguments.

If `options` are invalid but can be determined not to be the last argument of
any plugin's method, `isOptions()` should still return `true`. This allows
`getOptions()` to validate them and throw proper error messages.

```js
// `error.exampleMethod('one', true)` results in:
//   options: true
//   args: ['one']
// `error.exampleMethod('one', 'two')` results in:
//   options: undefined
//   args: ['one', 'two']
export default {
  name: 'example',
  isOptions(options) {
    return typeof options === 'boolean'
  },
  getOptions(options) {
    return options
  },
  instanceMethod: {
    exampleMethod({ options }, ...args) {
      // ...
    },
  },
}
```

## info

`info` is a plain object passed as the first argument to
[`properties()`](#properties), [instance methods](#instancemethodsmethodname)
and [static methods](#staticmethodsmethodname).

[`info.error`](#error) and [`info.showStack`](#showstack) are not passed to
[static methods](#staticmethodsmethodname).

Its members are readonly and should not be mutated, except for
[`info.error`](#error) inside [instance methods](#instancemethodsmethodname)
(not inside [`properties()`](#properties)).

### error

_Type_: `Error`

[Normalized](../README.md#normalize-errors) error instance.

```js
export default {
  name: 'example',
  properties({ error }) {
    return { isInputError: error.name === 'InputError' }
  },
}
```

### options

_Type_: `any`

Plugin's options, as returned by [`getOptions()`](#getoptions).

```js
export default {
  name: 'example',
  getOptions(options) {
    return options
  },
  // `new ErrorClass('message', { example: value })` sets `error.example: value`
  properties({ options }) {
    return { example: options }
  },
}
```

### showStack

_Type_: `boolean`

Hints whether `error.stack` should be printed or not.

This is `true` if the error (or one of its [inner](../README.md#wrap-errors)
errors) is [_unknown_](../README.md#unknown-errors), and `false` otherwise.

If a plugin prints `error.stack` optionally, `showStack` can be used as the
default value of a `stack` boolean option. This allows users to decide whether
to print `error.stack` or not, while still providing with a good default
behavior.

```js
export default {
  name: 'example',
  getOptions(options) {
    // ...
  },
  instanceMethods: {
    log({ error, showStack, options: { stack = showStack } }) {
      console.log(stack ? error.stack : error.message)
    },
  },
}
```

### AnyError

_Type_: `typeof AnyError`

Reference to [`AnyError`](../README.md#anyerror). This can be used to call
[`AnyError.normalize()`](../README.md#anyerrornormalizeanyexception) or
[`error instanceof AnyError`](../README.md#check-error-classes).

```js
export default {
  name: 'example',
  instanceMethods: {
    addErrors({ error, AnyError }, errors = []) {
      error.errors = errors.map(AnyError.normalize)
    },
  },
}
```

### ErrorClasses

_Type_: `object`

Object with all error classes created with
[`AnyError.subclass()`](../README.md#anyerrorsubclassname-options) or
`ErrorClass.subclass()`.

```js
export default {
  name: 'example',
  staticMethods: {
    isKnownErrorClass({ ErrorClasses }, value) {
      return Object.values(ErrorClasses).includes(value)
    },
  },
}
```

### errorInfo

_Type_: `(Error) => info`

Returns the [`info`](#info) object from a specific `Error`, except from
[`info.AnyError`](#anyerror), [`info.ErrorClasses`](#errorclasses) and
[`info.errorInfo`](#errorinfo).

```js
export default {
  name: 'example',
  staticMethods: {
    getLogErrors({ errorInfo }) {
      return function logErrors(errors) {
        errors.forEach((error) => {
          const { showStack } = errorInfo(error)
          console.log(showStack ? error.stack : error.message)
        })
      }
    },
  },
}
```

## TypeScript

`modern-errors` [exports its types](typescript.md#wide-types) for TypeScript
users.

### `Info`

The `Info` type refers to the [`info`](#info) parameter. It can be
`Info['properties']`, `Info['instanceMethods']`, `Info['staticMethods']` or
`Info['errorInfo']`.

```ts
import type { Info } from 'modern-errors'

const plugin = {
  // ...
  properties(info: Info['properties']) {
    // ...
  },
}
```

### `Plugin`

A `Plugin` type is available to validate the plugin's shape. However, it should
not be used on the exported type since this would widen it and remove any
specific types declared by that plugin.

```ts
import type { Plugin } from 'modern-errors'

export const plugin = {
  // ...
}

// This statement only validates the plugin's types.
// Unlike `export const plugin: Plugin = ...`, it does not widen any types.
const testPlugin: Plugin = plugin
```

### `name`

The [`name`](#name) property should be typed `as const` so it can be used to
validate the plugin's options.

```ts
const plugin = {
  name: 'example' as const,
  // ...
}
```

### `getOptions`

The types of [`getOptions()`](#getoptions)'s parameters are used to validate the
plugin's options.

```ts
// Any `{ example }` plugin option passed by users will be validated as boolean
const plugin = {
  name: 'example' as const,
  getOptions(options: boolean): boolean {
    // ...
  },
}
```

### `properties`, `instanceMethods` and `staticMethods`

The types of [`properties()`](#properties),
[`instanceMethods`](#instancemethodsmethodname) and
[`staticMethods`](#staticmethodsmethodname) are also exposed to plugin users.
Please note
[generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) are
currently ignored.

```ts
// Any `error.exampleMethod(input)` call will be validated
const plugin = {
  // ...
  instanceMethods: {
    exampleMethod(input: boolean): void {},
  },
}
```

## Publishing

Plugins can either be kept private or be published on npm. When public, we
recommend the following conventions to help users find plugins:

- The npm package name should be `[@scope/]modern-errors-${plugin.name}`
- The repository name should match the npm package name
- The `package.json` `keywords` should include `modern-errors` and
  `modern-errors-plugin`
- Please create an issue on the `modern-errors` repository so we can add the
  plugin to the [list of available ones](../README.md#plugins)! 🎉

We also recommend declaring some [types](#typescript) for TypeScript users.

## Best practices

### Options

#### Serializable options

Options types should ideally be JSON-serializable. This allows preserving them
when errors are
[serialized/parsed](https://github.com/ehmicky/modern-errors-serialize). In
particular, functions and class instances should be avoided in plugin options,
when possible.

#### Separate options

`modern-errors` provides with a
[consistent pattern](../README.md#plugin-options) for options. Plugins should
avoid alternatives like:

- Functions taking options as input and returning the plugin:
  `(options) => plugin`
- Setting options using the properties/methods of the plugin or another object

### State

#### Global state

Plugins should be usable by libraries. Therefore, modifying global objects (such
as `Error.prepareStackTrace()`) should be avoided.

#### Error-specific state

`WeakMap`s should be used to keep error-specific internal state, as opposed to
using error properties (even with `symbol` keys).

```js
const state = new WeakMap()

export default {
  name: 'example',
  instanceMethods: {
    exampleMethod({ error }) {
      state.set(error, { example: true })
    },
  },
}
```

#### State objects

Other state objects, such as class instances or network connections, should not
be kept in the global state. This ensures plugins are concurrency-safe, i.e. can
be safely used in parallel `async` logic. Instead, plugins should either:

- Provide with methods returning such objects
- Let users create those objects and pass them as arguments to plugin methods
