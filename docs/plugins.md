# Creating a plugin

This document explains how to create a plugin for `modern-errors`. The main
documentation explains how to [install](../README.md#adding-plugins),
[use](../README.md#adding-plugins) and
[configure](../README.md#configure-options) plugins.

## Features

Plugins can add:

- Error properties: `error.message`, `error.stack` or any other `error.*`
- Error instance methods: `error.exampleMethod()`
- [`AnyError`](../README.md#anyerror) static methods: `AnyError.exampleMethod()`

## Examples

[Existing plugins](../README.md#plugins) can be used for inspiration.

## API

Plugins are plain objects. We recommend exporting them using a
[default export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
for consistency with other plugins.

```js
export default {
  name: 'example',

  // Set error properties
  properties() {},

  // Set error instance methods like `error.exampleMethod()`
  instanceMethods: {
    exampleMethod() {},
  },

  // Set `AnyError` static methods like `AnyError.staticMethod()`
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

Plugin name. Only lowercase letters must be used (as opposed to `_-.` nor
uppercase letters).

This is the name used to [configure](../README.md#configure-options) the
plugin's options.

```js
// Users configure this plugin using `modernErrors([plugin], { example: ... })`
export default {
  name: 'example',
}
```

### properties

_Type_: `(info) => object`

Set properties on `error.*`. The properties to set must be returned as an
object. The `message` or `stack` can be returned as well.

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

Set error instance methods like `error.methodName(...args)`. If the logic
involves an `error` instance or error-specific `options`, instance methods
should be preferred over [static methods](#staticmethodsmethodname). Otherwise,
[static methods](#staticmethodsmethodname) should be used.

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

Set [`AnyError`](../README.md#anyerror) static methods like
`AnyError.methodName(...args)`.

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

Validate and normalize the plugin's `options`. If `options` is invalid, an
`Error` should be thrown. The normalized `options` should be returned.

The plugin's `options` can be anything. Unless `getOptions()` is defined, no
plugin's `options` are allowed.

<!-- eslint-disable unicorn/prefer-type-error -->

```js
// `error.exampleMethod('one', true)` results in:
//   options: true
//   args: ['one']
// `error.exampleMethod('one', 'two')` results in:
//   options: undefined
//   args: ['one', 'two']
export default {
  name: 'example',
  getOptions(options = true) {
    if (typeof options !== 'boolean') {
      throw new Error('It must be true or false')
    }

    return options
  },
}
```

#### full

`getOptions()` is called during:

- [`modernErrors()`](../README.md#modernerrorsplugins-options)
- [`AnyError.subclass()`](../README.md#anyerrorsubclassname-options)
- [`new ErrorClass()`](../README.md#simple-errors)
- [instance methods](#instancemethodsmethodname)
- [static methods](#staticmethodsmethodname)

The `full` parameter is a boolean indicating whether the `options` are partial.
It is `false` in the first two cases above, since `new ErrorClass()` might set
additional options.

When `full` is `false`, any logic validating required properties should be
skipped. The same applies to properties depending on each other.

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

### options

_Type_: `any`

Plugin's options, as returned by [`getOptions()`](#getoptions).

### error

_Type_: [_known_](../README.md#unknown-errors) `Error`

Error instance.

### unknownDeep

_Type_: `boolean`

`true` if the [innermost](../README.md#re-throw-errors) error is
[_unknown_](#unknown-errors), and `false` otherwise. This hints whether the
original error might be internal or come from an external library.

## Publishing

Plugins can either be kept private or be published on npm. When public, we
recommend the following convention to help users find plugins:

- The npm package name should be `[@scope/]modern-errors-${plugin.name}`
- The repository name should match the npm package name
- The `package.json` `keywords` should include `modern-errors` and
  `modern-errors-plugin`
