# Creating a plugin

This document explains how to create a plugin for `modern-errors`. To learn how
to [install](../README.md#adding-plugins), [use](../README.md#adding-plugins)
and [configure](../README.md#plugin-options) plugins, please refer to the
[main documentation](../README.md#-plugins) instead.

## Features

Plugins can add error:

- [Properties](#properties): `error.message`, `error.stack` or any other
  `error.*`
- [Instance methods](#instancemethodsmethodname):
  `ErrorClass.exampleMethod(error, ...args)` or `error.exampleMethod(...args)`
- [Static methods](#staticmethodsmethodname):
  `ErrorClass.exampleMethod(...args)`

## Examples

### Simple example

```js
export default {
  name: 'secret',
  properties({ error }) {
    return { message: error.message.replaceAll('secret', '******') }
  },
}
```

```js
import ModernError from 'modern-errors'

import secretPlugin from './secret.js'

const BaseError = ModernError.subclass('BaseError', { plugins: [secretPlugin] })
const error = new BaseError('Message with a secret')
console.log(error.message) // 'Message with a ******'
```

### Real-life examples

[Existing plugins](../README.md#plugins) can be used for inspiration.

### Template

The [following directory](../examples/plugin) contains a template to start a new
plugin, including [types](#typescript) and
[tests](../examples/plugin/main.test.ts).

## API

Plugins are plain objects with a
[default export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).
All members are optional except for [`name`](#name).

```js
export default {
  // Name used to configure the plugin
  name: 'example',

  // Set error properties
  properties(info) {
    return {}
  },

  // Add instance methods like `ErrorClass.exampleMethod(error, ...args)` or
  // `error.exampleMethod(...args)`
  instanceMethods: {
    exampleMethod(info, ...args) {
      // ...
    },
  },

  // Add static methods like `ErrorClass.staticMethod(...args)`
  staticMethods: {
    staticMethod(info, ...args) {
      // ...
    },
  },

  // Validate and normalize options
  getOptions(options, full) {
    return options
  },

  // Determine if a value is plugin's options
  isOptions(options) {
    return typeof options === 'boolean'
  },
}
```

### name

_Type_: `string`

Plugin's name. It is used to [configure](../README.md#plugin-options) the
plugin's options.

Only lowercase letters must be used (as opposed to `_` `-` `.` or uppercase
letters).

```js
// Users configure this plugin using
// `ErrorClass.subclass('ErrorName', { example: ... })`
// or `new ErrorClass('...', { example: ... })
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

Add error instance methods like `ErrorClass.methodName(error, ...args)` or
`error.methodName(...args)`.

Unlike [static methods](#staticmethodsmethodname), this should be used when the
method's main argument is an `error` instance.

The first argument [`info`](#info) is provided by `modern-errors`. The other
`...args` are forwarded from the method's call.

```js
export default {
  name: 'example',
  // `ErrorClass.concatMessage(error, "one")` or `error.concatMessage("one")`
  // return `${error.message} - one`
  instanceMethods: {
    concatMessage({ error }, string) {
      return `${error.message} - ${string}`
    },
  },
}
```

[Invalid errors](../README.md#invalid-errors) passed as `error` argument are
automatically [normalized](../README.md#-normalize-errors). This only occurs
when using `ErrorClass.methodName(error, ...args)`, not
`error.methodName(...args)`. For this reason, we discourage using or documenting
`error.methodName(...args)` unless there is a strong use case for it, since
users might accidentally call it without
[normalizing](../README.md#-normalize-errors) `error` first.

<!-- eslint-skip -->

```js
try {
  return regExp.test(value)
} catch (error) {
  ErrorClass.exampleMethod(error, ...args) // This works
  error.exampleMethod(...args) // This throws
}
```

### staticMethods.{methodName}

_Type_: `(info, ...args) => any`

Add error static methods like `ErrorClass.methodName(...args)`.

Unlike [instance methods](#instancemethodsmethodname), this should be used when
the method's main argument is _not_ an `error` instance.

The first argument [`info`](#info) is provided by `modern-errors`. The other
`...args` are forwarded from the method's call.

```js
export default {
  name: 'example',
  // `ErrorClass.multiply(2, 3)` returns `6`
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

The plugin's `options`'s type can be anything.

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
  [`ErrorClass.subclass('ExampleError', options)`](../README.md#create-error-classes)
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
// `ErrorClass.exampleMethod(error, 'one', true)` results in:
//   options: true
//   args: ['one']
// `ErrorClass.exampleMethod(error, 'one', 'two')` results in:
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

Its members are readonly and should not be directly mutated. Exception:
[instance methods](#instancemethodsmethodname) can mutate
[`info.error`](#error).

### error

_Type_: `Error`

[Normalized](../README.md#-normalize-errors) error instance. This is not defined
in [static methods](#staticmethodsmethodname).

```js
export default {
  name: 'example',
  properties({ error }) {
    return { isInputError: error.name === 'InputError' }
  },
}
```

### ErrorClass

_Type_: `ErrorClass`

Current [error class](../README.md#%EF%B8%8F-error-classes).

```js
export default {
  name: 'example',
  instanceMethods: {
    addErrors({ error, ErrorClass }, errors = []) {
      error.errors = errors.map(ErrorClass.normalize)
    },
  },
}
```

### ErrorClasses

_Type_: `ErrorClass[]`

Array containing both the [current error class](#errorclass) and all its
[subclasses](../README.md#error-subclasses) (including deep ones).

```js
export default {
  name: 'example',
  staticMethods: {
    isKnownErrorClass({ ErrorClasses }, value) {
      return ErrorClasses.includes(value)
    },
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

### errorInfo

_Type_: `(Error) => info`

Returns the [`info`](#info) object from a specific `Error`. All members are
present except for `info.errorInfo` itself.

```js
export default {
  name: 'example',
  staticMethods: {
    getLogErrors({ errorInfo }) {
      return function logErrors(errors) {
        errors.forEach((error) => {
          const { options } = errorInfo(error)
          console.error(options.example?.stack ? error.stack : error.message)
        })
      }
    },
  },
}
```

## TypeScript

Any plugin's types are automatically exposed to its TypeScript users.

### `getOptions`

The types of [`getOptions()`](#getoptions)'s parameters are used to validate the
plugin's options.

```ts
// Any `{ example }` plugin option passed by users will be validated as boolean
export default {
  name: 'example' as const,
  getOptions(options: boolean): object {
    // ...
  },
}
```

### `name`

The [`name`](#name) property should be typed `as const` so it can be used to
validate the plugin's options.

```ts
export default {
  name: 'example' as const,
  // ...
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
// Any `ErrorClass.exampleMethod(error, input)` or `error.exampleMethod(input)`
// call will be validated
export default {
  // ...
  instanceMethods: {
    exampleMethod(info: Info['instanceMethods'], input: boolean): void {},
  },
}
```

### `Info`

The [`info`](#info) parameter can be typed with `Info['properties']`,
`Info['instanceMethods']`, `Info['staticMethods']` or `Info['errorInfo']`.

```ts
import type { Info } from 'modern-errors'

export default {
  // ...
  properties(info: Info['properties']) {
    // ...
  },
}
```

### `Plugin`

A `Plugin` type is available to validate the plugin's shape.
[`satisfies Plugin`](https://devblogs.microsoft.com/typescript/announcing-typescript-4-9-rc/#the-satisfies-operator)
should be used (as opposed to `const plugin: Plugin = { ... }`) to prevent
widening it and removing any specific types declared by that plugin.

```ts
import type { Plugin } from 'modern-errors'

export default {
  // ...
} satisfies Plugin
```

## Publishing

If the plugin is published on npm, we recommend the following conventions:

- [ ] The npm package name should be `[@scope/]modern-errors-${plugin.name}`
- [ ] The repository name should match the npm package name
- [ ] `"modern-errors"` and `"modern-errors-plugin"` should be added as both
      [`package.json` `keywords`](https://www.npmjs.com/search?q=keywords:modern-errors-plugin)
      and [GitHub topics](https://github.com/topics/modern-errors-plugin)
- [ ] `"modern-errors"` should be added in the `package.json`'s
      [`peerDependencies`](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies),
      not in the production `dependencies`, `devDependencies` nor
      `bundledDependencies`. Its semver range should start with `^`. Also,
      [`peerDependenciesMeta.modern-errors.optional`](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependenciesmeta)
      should not be used.
- [ ] The `README` should document how to:
  - [ ] Add the plugin to `modern-errors`
        ([example](https://github.com/ehmicky/modern-errors-cli#example))
  - [ ] Configure options, if there are any
        ([example](https://github.com/ehmicky/modern-errors-cli#configuration))
- [ ] The plugin should export its [types](#-typescript) for TypeScript users
- [ ] Please create an issue on the `modern-errors` repository so we can add the
      plugin to the [list of available ones](../README.md#plugins)! 🎉

## Best practices

### Options

#### Serializable options

Options types should ideally be JSON-serializable. This allows preserving them
when errors are
[serialized/parsed](https://github.com/ehmicky/modern-errors-serialize). In
particular, functions and class instances should be avoided in plugin options,
when possible.

#### Separate options

`modern-errors` provides with a pattern for options that enables them to be:

- Passed [at multiple stages](../README.md#plugin-options)
- Validated as soon as users pass them
- [Automatically typed](#getoptions-1)
- Consistent between different plugins

```js
export default {
  name: 'example',
  getOptions(options) {
    return options
  },
  instanceMethods: {
    exampleMethod(info) {
      console.log(info.options.exampleOption)
    },
  },
}
```

Plugins should avoid alternatives since they would lose those benefits. This
includes:

- Error method arguments, for any configuration option

```js
export default {
  name: 'example',
  instanceMethods: {
    exampleMethod(exampleOption) {
      console.log(exampleOption)
    },
  },
}
```

- Error properties

```js
export default {
  name: 'example',
  instanceMethods: {
    exampleMethod(info) {
      console.log(info.error.exampleOption)
    },
  },
}
```

- Top-level objects

```js
export const pluginOptions = {}

export default {
  name: 'example',
  instanceMethods: {
    exampleMethod() {
      console.log(pluginOptions.exampleOption)
    },
  },
}
```

- Functions taking options as input and returning the plugin

```js
export default function getPlugin(exampleOption) {
  return {
    name: 'example',
    instanceMethods: {
      exampleMethod() {
        console.log(exampleOption)
      },
    },
  }
}
```

### State

#### Global state

Plugins should be usable by libraries. Therefore, modifying global objects (such
as `Error.prepareStackTrace()`) should be avoided.

#### Error-specific state

`WeakMap`s should be used to keep error-specific internal state, as opposed to
using error properties (even with `symbol` keys). This ensures those properties
are not exposed to users not printed or serialized.

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
