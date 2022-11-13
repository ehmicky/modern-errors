<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors_dark.svg"/>
  <img alt="modern-errors logo" src="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors.svg" width="600"/>
</picture>

[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/modern-errors)
[![Browsers](https://img.shields.io/badge/-Browsers-808080?logo=firefox&colorA=404040)](https://unpkg.com/modern-errors?module)
[![TypeScript](https://img.shields.io/badge/-Typed-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/types/main.d.ts)
[![Codecov](https://img.shields.io/badge/-Tested%20100%25-808080?logo=codecov&colorA=404040)](https://codecov.io/gh/ehmicky/modern-errors)
[![Minified size](https://img.shields.io/bundlephobia/minzip/modern-errors?label&colorA=404040&colorB=808080&logo=webpack)](https://bundlephobia.com/package/modern-errors)
[![Twitter](https://img.shields.io/badge/-Twitter-808080.svg?logo=twitter&colorA=404040)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

Handle errors like it's 2023 🔮

Error handling framework that is pluggable, minimalist yet featureful.

# Features

- ⛑️ Create [error classes](#create-error-classes) (including with
  [custom logic](#-custom-logic))
- 🏷️ Set properties on [individual errors](#error-instance-properties) or on
  [all errors of the same class](#error-class-properties)
- 🎀 Wrap errors' [message](#wrap-error-message), [class](#wrap-error-class) and
  [properties](#wrap-error-options)
- 🚨 Normalize [invalid errors](#invalid-errors) (not an `Error` instance,
  missing `stack`, etc.)
- 🐞 Separate known and [unknown errors](#-unknown-errors)
- 🤓 Strict [TypeScript types](docs/typescript.md)
- 📖 Based on standard JavaScript: [`throw`](#%EF%B8%8F-throw-errors),
  [`try/catch`](#-wrap-errors), [`new Error()`](#%EF%B8%8F-throw-errors),
  [`error.cause`](#-wrap-errors), [`instanceof`](#check-error-classes),
  [`class`](#-custom-logic),
  [`toJSON()`](https://github.com/ehmicky/modern-errors-serialize#errortojson)

# Plugins

- [`modern-errors-cli`](https://github.com/ehmicky/modern-errors-cli): Handle
  errors in CLI modules
- [`modern-errors-process`](https://github.com/ehmicky/modern-errors-process):
  Handle process errors
- [`modern-errors-bugs`](https://github.com/ehmicky/modern-errors-bugs): Print
  where to report bugs
- [`modern-errors-serialize`](https://github.com/ehmicky/modern-errors-serialize):
  Serialize/parse errors
- [`modern-errors-clean`](https://github.com/ehmicky/modern-errors-clean): Clean
  stack traces
- [`modern-errors-http`](https://github.com/ehmicky/modern-errors-http): Create
  HTTP error responses
- [`modern-errors-winston`](https://github.com/ehmicky/modern-errors-winston):
  Log errors with Winston
- 🔌 Create your [own plugin](docs/plugins.md)

# Example

Create [error classes](#%EF%B8%8F-error-classes).

```js
import ModernError from 'modern-errors'

export const BaseError = ModernError.subclass('BaseError')

export const UnknownError = BaseError.subclass('UnknownError')
export const InputError = BaseError.subclass('InputError')
export const AuthError = BaseError.subclass('AuthError')
export const DatabaseError = BaseError.subclass('DatabaseError')
```

[Throw](#%EF%B8%8F-throw-errors) errors.

```js
throw new InputError('Missing file path.')
```

[Wrap](#-wrap-errors) errors.

```js
try {
  // ...
} catch (cause) {
  throw new InputError('Could not read the file.', { cause })
}
```

[Normalize](#-normalize-errors) errors.

<!-- eslint-disable no-throw-literal -->

```js
try {
  throw 'Missing file path.'
} catch (error) {
  // Normalized from a string to a `BaseError` instance
  throw BaseError.normalize(error)
}
```

Use [plugins](#-plugins).

```js
import ModernError from 'modern-errors'
import modernErrorsSerialize from 'modern-errors-serialize'

export const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsSerialize],
})

// ...

// Serialize error as JSON, then back to identical error instance
const error = new InputError('Missing file path.')
const errorString = JSON.stringify(error)
const identicalError = BaseError.parse(JSON.parse(errorString))
```

# Install

```bash
npm install modern-errors
```

If any [plugin](#-plugins) is used, it must also be installed.

```bash
npm install modern-errors-{pluginName}
```

This package works in both Node.js >=14.18.0 and
[browsers](https://raw.githubusercontent.com/ehmicky/dev-tasks/main/src/tasks/build/browserslist).
It is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# Usage

## ⛑️ Error classes

### Create error classes

```js
import ModernError from 'modern-errors'

export const BaseError = ModernError.subclass('BaseError')

export const UnknownError = BaseError.subclass('UnknownError')
export const InputError = BaseError.subclass('InputError')
export const AuthError = BaseError.subclass('AuthError')
export const DatabaseError = BaseError.subclass('DatabaseError')
```

### Export error classes

Exporting and documenting all error classes (except for
[`ModernError`](#modernerror)) allows consumers to check them. This also enables
sharing error classes between modules.

### Check error classes

```js
if (error instanceof InputError) {
  // ...
}
```

## 🏷️ Throw errors

### Simple errors

```js
throw new InputError('Missing file path.')
```

### Error instance properties

```js
const error = new InputError('...', { props: { isUserError: true } })
console.log(error.isUserError) // true
```

### Error class properties

```js
const InputError = BaseError.subclass('InputError', {
  props: { isUserError: true },
})
const error = new InputError('...')
console.log(error.isUserError) // true
```

### Aggregate errors

The [`errors` option](#optionserrors) aggregates multiple errors into one. This
is like
[`new AggregateError(errors)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError/AggregateError)
except that it works with any error class.

```js
const databaseError = new DatabaseError('...')
const authError = new AuthError('...')
throw new InputError('...', { errors: [databaseError, authError] })
// InputError: ... {
//   [errors]: [
//     DatabaseError: ...
//     AuthError: ...
//   ]
// }
```

## 🎀 Wrap errors

### Wrap inner error

Any error's [message](#wrap-error-message), [class](#wrap-error-class) and
[options](#wrap-error-options) can be wrapped using the
[standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)
[`cause` option](#optionscause).

Instead of being set as a `cause` property, the inner error is directly
[merged](https://github.com/ehmicky/merge-error-cause) to the outer error,
including its
[`message`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message),
[`stack`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack),
[`name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name),
[`AggregateError.errors`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
and any [additional property](#error-instance-properties).

```js
try {
  // ...
} catch (cause) {
  throw new InputError('Could not read the file.', { cause })
}
```

### Wrap error message

The outer error message is appended, unless it is empty. If the outer error
message ends with `:` or `:\n`, it is prepended instead.

```js
const cause = new InputError('File does not exist.')
// InputError: File does not exist.
throw new InputError('', { cause })
```

```js
// InputError: File does not exist.
// Could not read the file.
throw new InputError('Could not read the file.', { cause })
```

```js
// InputError: Could not read the file: File does not exist.
throw new InputError(`Could not read the file:`, { cause })
```

```js
// InputError: Could not read the file:
// File does not exist.
throw new InputError(`Could not read the file:\n`, { cause })
```

### Wrap error class

The outer error's class replaces the inner one.

```js
try {
  throw new AuthError('...')
} catch (cause) {
  // Now an InputError
  throw new InputError('...', { cause })
}
```

Except when the outer error's class is a parent class, such as
[`BaseError`](#create-error-classes).

```js
try {
  throw new AuthError('...')
} catch (cause) {
  // Still an AuthError
  throw new BaseError('...', { cause })
}
```

### Wrap error options

The outer error's [`props`](#error-instance-properties) and
[plugin options](#plugin-options) are merged.

```js
try {
  throw new AuthError('...', innerOptions)
} catch (cause) {
  // `outerOptions` are merged with `innerOptions`
  throw new BaseError('...', { ...outerOptions, cause })
}
```

## 🚨 Normalize errors

### Wrapped errors

Any error can be directly passed to the [`cause` option](#wrap-inner-error),
even if it is [invalid](#invalid-errors), [unknown](#-unknown-errors) or not
[normalized](#errorclassnormalizeerror-newerrorclass).

```js
try {
  // ...
} catch (cause) {
  throw new InputError('...', { cause })
}
```

### Invalid errors

Manipulating errors that are not
[`Error` instances](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
or that have
[invalid properties](https://github.com/ehmicky/normalize-exception#features)
can lead to unexpected bugs.
[`BaseError.normalize()`](#errorclassnormalizeerror-newerrorclass) fixes that.

<!-- eslint-disable no-throw-literal -->

```js
try {
  throw 'Missing file path.'
} catch (invalidError) {
  // This fails: `invalidError.message` is `undefined`
  console.log(invalidError.message.trim())
}
```

<!-- eslint-disable no-throw-literal -->

```js
try {
  throw 'Missing file path.'
} catch (invalidError) {
  const normalizedError = BaseError.normalize(invalidError)
  // This works: 'Missing file path.'
  // `normalizedError` is a `BaseError` instance.
  console.log(normalizedError.message.trim())
}
```

### Top-level error handler

Wrapping a module's main functions with
[`BaseError.normalize()`](#errorclassnormalizeerror-newerrorclass) ensures every
error being thrown is [valid](#invalid-errors), applies
[plugins](#using-plugins-with-unknown-errors), and has a class that is either
[_known_](#create-error-classes) or [`UnknownError`](#-unknown-errors).

```js
export const main = function () {
  try {
    // ...
  } catch (error) {
    throw BaseError.normalize(error, UnknownError)
  }
}
```

## 🐞 Unknown errors

### Normalizing unknown errors

An error is _unknown_ if its class is not a
[subclass](#errorclasssubclassname-options) of the
[`BaseError`](#create-error-classes). This indicates an unexpected exception,
usually a bug.

[`BaseError.normalize(error, UnknownError)`](#errorclassnormalizeerror-newerrorclass)
assigns the `UnknownError` class to those errors. This is usually performed in
the [top-level error handler](#top-level-error-handler).

```js
export const UnknownError = BaseError.subclass('UnknownError')
```

<!-- eslint-skip -->

```js
try {
  return regExp.test(value)
} catch (error) {
  // Now an `UnknownError` instance
  throw BaseError.normalize(error, UnknownError)
}
```

### Handling unknown errors

_Unknown_ errors should be handled in a `try {} catch {}` block and
[wrapped](#wrap-error-class) with a [_known_ class](#create-error-classes)
instead. That block should only cover the statement that might throw in order to
prevent catching other unrelated _unknown_ errors.

<!-- eslint-skip -->

```js
try {
  return regExp.test(value)
} catch (error) {
  // Now an `InputError` instance
  throw new InputError('Invalid regular expression:', { cause: error })
}
```

### Using plugins with unknown errors

[`BaseError.normalize()`](#errorclassnormalizeerror-newerrorclass) is required
for [_unknown_ errors](#-unknown-errors) to use [plugins](#-plugins).

<!-- eslint-skip -->

```js
try {
  return regExp.test(value)
} catch (error) {
  error.examplePluginMethod() // This throws

  const normalizedError = BaseError.normalize(error)
  normalizedError.examplePluginMethod() // This works
}
```

## 🔌 Plugins

### List of plugins

Plugins extend `modern-errors` features. All available plugins are
[listed here](#plugins).

### Adding plugins

To use a plugin, please install it, then pass it to the
[`plugins` option](#optionsplugins).

```bash
npm install modern-errors-{pluginName}
```

<!-- eslint-disable import/order -->

```js
import ModernError from 'modern-errors'

import modernErrorsBugs from 'modern-errors-bugs'
import modernErrorsSerialize from 'modern-errors-serialize'

export const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsBugs, modernErrorsSerialize],
})
// ...
```

### Plugin options

Most plugins can be configured with options. The option's name is the same as
the plugin.

```js
const options = {
  // `modern-errors-bugs` options
  bugs: 'https://github.com/my-name/my-project/issues',
  // `props` can be configured and modified like plugin options
  props: { userId: 5 },
}
```

Plugin options can apply to (in priority order):

- Any error: second argument to [`ModernError.subclass()`](#options-1)

```js
export const BaseError = ModernError.subclass('BaseError', options)
```

- Any error of a specific class (and its subclasses): second argument to
  [`ErrorClass.subclass()`](#options-1)

```js
export const InputError = BaseError.subclass('InputError', options)
```

- A specific error: second argument to [`new ErrorClass()`](#options-3)

```js
throw new InputError('...', options)
```

- A plugin method call: last argument, passing only that plugin's options

```js
ErrorClass[methodName](...args, options[pluginName])
```

```js
error[methodName](...args, options[pluginName])
```

### Custom plugins

Please see the [following documentation](docs/plugins.md) to create your own
plugin.

## 🔧 Custom logic

### Class custom logic

The [`custom` option](#optionscustom) can be used to provide an error `class`
with additional methods, `constructor` or properties.

<!-- eslint-disable no-param-reassign, fp/no-mutation,
     class-methods-use-this -->

```js
export const InputError = BaseError.subclass('InputError', {
  // The `class` must extend from the parent error class
  custom: class extends BaseError {
    // If a `constructor` is defined, its parameters must be (message, options)
    constructor(message, options) {
      message += message.endsWith('.') ? '' : '.'
      super(message, options)
    }

    isUserInput() {
      // ...
    }
  },
})

const error = new InputError('Wrong user name')
console.log(error.message) // 'Wrong user name.'
console.log(error.isUserInput())
```

### Shared custom logic

[`ErrorClass.subclass()`](#errorclasssubclassname-options) can be used to share
logic between error classes.

```js
const SharedError = BaseError.subclass('SharedError', {
  custom: class extends BaseError {
    // ...
  },
})

export const InputError = SharedError.subclass('InputError')
export const AuthError = SharedError.subclass('AuthError')
```

## 🤓 TypeScript

Please see the [following documentation](docs/typescript.md) for information
about TypeScript types.

# API

## ModernError

Top-level `ErrorClass`.

## ErrorClass.subclass(name, options?)

`name`: `string`\
`options`: [`ClassOptions?`](#options)

Creates and returns a child `ErrorClass`.

### options

#### options.props

_Type_: `object`

[Error class properties](#error-class-properties).

#### options.plugins

_Type_: [`Plugin[]`](#-plugins)

#### options.custom

_Type_: `class extends ErrorClass {}`

[Custom class](#-custom-logic) to add any methods, `constructor` or properties.

#### options.\*

Any [plugin options](#plugin-options) can also be specified.

## new ErrorClass(message, options?)

`message`: `string`\
`options`: [`InstanceOptions?`](#options-2)\
_Return value_: `Error`

### options

#### options.props

_Type_: `object`

[Error instance properties](#error-instance-properties).

#### options.cause

_Type_: [`any`](#wrapped-errors)

Inner error being [wrapped](#-wrap-errors).

#### options.errors

_Type_: `any[]`

Array of errors being [aggregated](#aggregate-errors).

#### options.\*

Any [plugin options](#plugin-options) can also be specified.

## ErrorClass.normalize(error, NewErrorClass?)

`error`: `any`\
`NewErrorClass`: `subclass of ErrorClass`\
_Return value_: `Error`

Normalizes [invalid errors](#invalid-errors).

If the `error`'s class is a subclass of `ErrorClass`, it is left as is.
Otherwise, it is [converted to `NewErrorClass`](#normalizing-unknown-errors),
which defaults to `ErrorClass` itself.

# Modules

This framework brings together a collection of modules which can also be used
individually:

- [`error-custom-class`](https://github.com/ehmicky/error-custom-class): Create
  one error class
- [`error-class-utils`](https://github.com/ehmicky/error-class-utils): Utilities
  to properly create error classes
- [`error-serializer`](https://github.com/ehmicky/error-serializer): Convert
  errors to/from plain objects
- [`normalize-exception`](https://github.com/ehmicky/normalize-exception):
  Normalize exceptions/errors
- [`is-error-instance`](https://github.com/ehmicky/is-error-instance): Check if
  a value is an `Error` instance
- [`merge-error-cause`](https://github.com/ehmicky/merge-error-cause): Merge an
  error with its `cause`
- [`set-error-class`](https://github.com/ehmicky/set-error-class): Properly
  update an error's class
- [`set-error-message`](https://github.com/ehmicky/set-error-message): Properly
  update an error's message
- [`set-error-props`](https://github.com/ehmicky/set-error-props): Properly
  update an error's properties
- [`handle-cli-error`](https://github.com/ehmicky/handle-cli-error): 💣 Error
  handler for CLI applications 💥
- [`log-process-errors`](https://github.com/ehmicky/log-process-errors): Show
  some ❤ to Node.js process errors

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/modern-errors/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/modern-errors/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
