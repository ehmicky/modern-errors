# Creating a plugin

This document explains how to create a plugin for `modern-errors`. To learn how
to [install](../README.md#adding-plugins), [use](../README.md#adding-plugins)
and [configure](../README.md#configure-options) plugins, please refer to the
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

```js
export default {
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

Plugin's name. It is used to [configure](../README.md#configure-options) the
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

The first argument `info` is provided by `modern-errors`. The other `...args`
are forwarded from the method's call.

If the logic involves an `error` instance or error-specific `options`, instance
methods should be preferred over [static methods](#staticmethodsmethodname).
Otherwise, [static methods](#staticmethodsmethodname) should be used.

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

The first argument `info` is provided by `modern-errors`. The other `...args`
are forwarded from the method's call.

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

Normalize and return the plugin's `options`. Required to use them.

If `options` is invalid, an `Error` should be thrown. The error message is
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

Users can pass additional `options`
[at multiple stages](../README.md#configure-options). Each stage calls
`getOptions()`:

- When error classes are defined:
  [`modernErrors()`](../README.md#modernerrorsplugins-options) and
  [`AnyError.subclass()`](../README.md#anyerrorsubclassname-options)
- When new errors are created: [`new ErrorClass()`](../README.md#simple-errors)
- When [instance methods](#instancemethodsmethodname) or
  [static methods](#staticmethodsmethodname) are called

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

`isOptions()` determines whether the last argument of a plugin method are
`options` or not. Users [can optionally pass](../README.md#configure-options)
the plugin's `options` as a last argument to any plugin method (instance or
static). This should be defined if the plugin has any method with arguments.

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
and [static methods](#staticmethodsmethodname). `info.error` and
`info.unknownDeep` are not passed to static methods.

Its members are readonly and cannot be mutated, except for `error` inside
instance methods (not inside `properties()`).

### error

_Type_: [_known_](../README.md#unknown-errors) `Error`

Error instance.

```js
export default {
  name: 'example',
  properties({ error }) {
    return { isTypeError: error.name === 'TypeError' }
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

### unknownDeep

_Type_: `boolean`

`true` if the [innermost](../README.md#re-throw-errors) error is
[_unknown_](#unknown-errors), and `false` otherwise. This hints whether the
original error might be internal or come from an external library.

```js
export default {
  name: 'example',
  instanceMethods: {
    log({ error, unknownDeep }) {
      console.log(unknownDeep ? error.message : error.stack)
    },
  },
}
```

### AnyError

_Type_: `typeof AnyError`

Reference to [`AnyError`](../README.md#anyerror). This can be used to call
[`AnyError.normalize()`](../README.md#anyerrornormalizeanyexception) or
[`error instanceof AnyError`](../README.md#check-error-class).

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

Object with all [_known_](../README.md#unknown-errors) error classes.

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

## Publishing

Plugins can either be kept private or be published on npm. When public, we
recommend the following convention to help users find plugins:

- The npm package name should be `[@scope/]modern-errors-${plugin.name}`
- The repository name should match the npm package name
- The `package.json` `keywords` should include `modern-errors` and
  `modern-errors-plugin`
- Please feel free to create an issue on the `modern-errors` repository so we
  can add the plugin to the [list of available ones](../README.md#plugins)! 🎉
