<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors_dark.svg"/>
  <img alt="modern-errors logo" src="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors.svg" width="600"/>
</picture>

[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/modern-errors.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/modern-errors)
[![TypeScript](https://img.shields.io/badge/-typed-brightgreen?logo=typescript&colorA=gray&logoColor=0096ff)](/src/main.d.ts)
[![Node](https://img.shields.io/node/v/modern-errors.svg?logo=node.js&logoColor=66cc33)](https://www.npmjs.com/package/modern-errors)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-brightgreen.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-brightgreen.svg?logo=medium)](https://medium.com/@ehmicky)

Handle errors like it's 2022 🔮

Error handling framework that is pluggable, minimalist yet featureful.

# Features

- Create [error classes](#create-error-classes) (including with
  [custom logic](#custom-logic))
- Set properties on [individual errors](#error-instance-properties) or on
  [all errors of the same class](#error-class-properties)
- Wrap errors' [message](#wrap-error-message), [class](#wrap-error-class) and
  [properties](#wrap-error-options)
- Separate known and [unknown errors](#unknown-errors)
- Normalize [invalid errors](#invalid-errors) (not an `Error` instance, missing
  `stack`, etc.)
- Based on standard JavaScript: [`throw`](#throw-errors),
  [`try/catch`](#wrap-errors), [`new Error()`](#throw-errors),
  [`error.cause`](#wrap-errors), [`instanceof`](#check-error-classes),
  [`class`](#custom-logic), [`toJSON()`](docs/plugins/serialize.md)

# Plugins

- [`modern-errors-cli`](docs/plugins/cli.md): Handle errors in CLI modules
- [`modern-errors-process`](docs/plugins/process.md): Handle process errors
- [`modern-errors-bugs`](docs/plugins/bugs.md): Print where to report bugs
- [`modern-errors-serialize`](docs/plugins/serialize.md): Serialize/parse errors
- [`modern-errors-stack`](docs/plugins/stack.md): Clean stack traces
- [`modern-errors-http`](docs/plugins/http.md): Convert errors to HTTP response
  objects
- [`modern-errors-winston`](docs/plugins/winston.md): Log errors with Winston
- Create your [own plugin](#custom-plugins)

# Example

Create [error classes](#error-classes).

```js
import modernErrors from 'modern-errors'

// Base error class
export const AnyError = modernErrors()

export const UnknownError = AnyError.subclass('UnknownError')
export const InputError = AnyError.subclass('InputError')
export const AuthError = AnyError.subclass('AuthError')
export const DatabaseError = AnyError.subclass('DatabaseError')
```

[Throw](#throw-errors) errors.

```js
throw new InputError('Missing file path.')
```

[Wrap](#wrap-errors) errors.

```js
try {
  // ...
} catch (cause) {
  throw new InputError('Could not read the file.', { cause })
}
```

[Normalize](#normalize-errors) errors.

<!-- eslint-disable no-throw-literal -->

```js
try {
  throw 'Missing file path.'
} catch (error) {
  // Normalized from a string to an `Error` instance
  throw AnyError.normalize(error)
}
```

Use [plugins](#plugins-1).

```js
import modernErrors from 'modern-errors'
import modernErrorsSerialize from 'modern-errors-serialize'

// Use a plugin to serialize errors as JSON
export const AnyError = modernErrors([modernErrorsSerialize])

// ...

// Serialize error as JSON, then back to identical error instance
const error = new InputError('Missing file path.')
const errorString = JSON.stringify(error)
const identicalError = AnyError.parse(JSON.parse(errorString))
```

# Install

```bash
npm install modern-errors
```

If any [plugin](#plugins-1) is used, it must also be installed.

```bash
npm install modern-errors-{pluginName}
```

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## modernErrors(plugins?, options?)

`plugins`: [`Plugin[]?`](#plugins-1)\
`options`: [`Options?`](#options)

Creates and returns [`AnyError`](#anyerror).

## AnyError

Base error class. Cannot be instantiated, except when
[wrapping errors](#wrap-error-class).

### AnyError.subclass(name, options?)

`name`: `string`\
`options`: [`Options?`](#options)\
_Return value_: `class extends AnyError {}`

Creates and returns an error subclass. The first one must be named
[`UnknownError`](#unknown-errors).

Subclasses can [also call](#shared-custom-logic) `ErrorClass.subclass()`
themselves.

### AnyError.normalize(anyException)

_Type_: `(anyException) => AnyError`

Normalizes [invalid errors](#invalid-errors) and assigns the `UnknownError`
class to [_unknown_ errors](#unknown-errors).

## Options

### props

_Type_: `object`

[Error properties](#error-instance-properties).

### custom

_Type_: `class extends AnyError {}`

[Custom class](#custom-logic) to add any methods, `constructor` or properties.
It must `extends` from [`AnyError`](#anyerror).

### Plugin options

Any [plugin options](#plugin-options-1) can also be specified.

# Usage

## Error classes

### Create error classes

```js
// Base error class
export const AnyError = modernErrors()

// The first error class must be named "UnknownError"
export const UnknownError = AnyError.subclass('UnknownError')
export const InputError = AnyError.subclass('InputError')
export const AuthError = AnyError.subclass('AuthError')
export const DatabaseError = AnyError.subclass('DatabaseError')
```

### Check error classes

<!-- eslint-disable max-depth -->

```js
try {
  // ...
} catch (error) {
  // Known `InputError`
  if (error instanceof InputError) {
    // ...
  }

  // Unknown error (from that specific library)
  if (error instanceof UnknownError) {
    // ...
  }

  // Any error (from that specific library)
  if (error instanceof AnyError) {
    // ...
  }
}
```

### Export error classes

Exporting and documenting error classes 
(including [`AnyError`](#anyerror) and
[`UnknownError`](#unknown-errors)), so
users can check them.
This also allows other modules to re-use
them.

## Throw errors

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
const InputError = AnyError.subclass('InputError', {
  props: { isUserError: true },
})
const error = new InputError('...')
console.log(error.isUserError) // true
```

### Aggregate errors

The `errors` option aggregates multiple errors into one. This is like
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

## Wrap errors

### Wrap inner error

Any error's [message](#wrap-error-message), [class](#wrap-error-class) and
[options](#wrap-error-options) can be wrapped using the
[standard `cause` option](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause).

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

The outer error's class replaces the inner one's, unless the outer error's class
is [`AnyError`](#anyerror).

```js
try {
  throw new AuthError('...')
} catch (cause) {
  // Now an InputError
  throw new InputError('...', { cause })
}
```

```js
try {
  throw new AuthError('...')
} catch (cause) {
  // Still an AuthError
  throw new AnyError('...', { cause })
}
```

### Wrap error options

The outer error's options ([`props`](#props) and
[plugin options](#plugin-options-1)) replace the inner one's. If the outer
error's class is [`AnyError`](#anyerror), those are merged instead.

```js
try {
  throw new AuthError('...', innerOptions)
} catch (cause) {
  // Options are now `outerOptions`. `innerOptions` are discarded.
  throw new InputError('...', { ...outerOptions, cause })
}
```

```js
try {
  throw new AuthError('...', innerOptions)
} catch (cause) {
  // `outerOptions` are merged with `innerOptions`
  throw new AnyError('...', { ...outerOptions, cause })
}
```

## Normalize errors

### Wrapped errors

Any error can be directly passed to the [`cause` option](#wrap-inner-error),
even if it is [invalid](#invalid-errors), [unknown](#unknown-errors) or not
[normalized](#anyerrornormalizeanyexception).

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
[`AnyError.normalize()`](#anyerrornormalizeanyexception) fixes that.

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
  const normalizedError = AnyError.normalize(invalidError)
  // This works: 'Missing file path.'
  // `normalizedError` is an `Error` instance.
  console.log(normalizedError.message.trim())
}
```

### Top-level error handler

Wrapping a module's main functions with
[`AnyError.normalize()`](#anyerrornormalizeanyexception) ensures every error
being thrown is [valid](#invalid-errors), applies
[plugins](#using-plugins-with-unknown-errors), and has a class that is either
[_known_](#create-error-classes) or [`UnknownError`](#unknown-errors).

```js
export const main = function () {
  try {
    // ...
  } catch (error) {
    throw AnyError.normalize(error)
  }
}
```

### Unknown errors

#### Normalizing unknown errors

An error is _unknown_ if its class was not created by
[`AnyError.subclass()`](#anyerrorsubclassname-options). This indicates an
unexpected exception, usually a bug.
[`AnyError.normalize()`](#anyerrornormalizeanyexception) assigns the
[`UnknownError` class](#create-error-classes) to any _unknown_ error.

<!-- eslint-skip -->

```js
try {
  return regExp.test(value)
} catch (unknownError) {
  // Now an `UnknownError` instance
  throw AnyError.normalize(unknownError)
}
```

#### Handling unknown errors

_Unknown_ errors should be handled in a `try {} catch {}` block and
[wrapped](#wrap-error-class) with a [_known_ class](#create-error-classes)
instead. That block should only cover the statement that might throw in order to
prevent catching other unrelated _unknown_ errors.

<!-- eslint-skip -->

```js
try {
  return regExp.test(value)
} catch (unknownError) {
  // Now an `InputError` instance
  throw new InputError('Invalid regular expression:', { cause: unknownError })
}
```

#### Using plugins with unknown errors

[`AnyError.normalize()`](#anyerrornormalizeanyexception) is required for
[_unknown_ errors](#unknown-errors) to use [plugins](#plugins-1).

<!-- eslint-skip -->

```js
try {
  return regExp.test(value)
} catch (unknownError) {
  unknownError.examplePluginMethod() // This throws

  const normalizedError = AnyError.normalize(unknownError)
  normalizedError.examplePluginMethod() // This works
}
```

## Custom logic

### Class custom logic

The [`custom`](#custom) option can be used to provide an error `class` with
additional methods, `constructor` or properties.

<!-- eslint-disable no-param-reassign, fp/no-mutation, fp/no-this,
     class-methods-use-this -->

```js
export const InputError = AnyError.subclass('InputError', {
  // The `class` must extend from `AnyError`
  custom: class extends AnyError {
    // If a `constructor` is defined, its parameters must be (message, options)
    // like `AnyError`
    constructor(message, options) {
      // Modifying `message` or `options` should be done before `super()`
      message += message.endsWith('.') ? '' : '.'

      // All arguments should be forwarded to `super()`, including any
      // custom `options` or additional `constructor` parameters
      super(message, options)

      // `name` is automatically added, so this is not necessary
      // this.name = 'InputError'
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

[`ErrorClass.subclass()`](#anyerrorsubclassname-options) can be used to share
logic between error classes.

<!-- eslint-disable fp/no-this, class-methods-use-this -->

```js
const SharedError = AnyError.subclass('SharedError', {
  custom: class extends AnyError {
    // ...
  },
})

export const InputError = SharedError.subclass('InputError')
export const AuthError = SharedError.subclass('AuthError')
```

## Plugins

### List of plugins

Plugins extend `modern-errors` features. All available plugins are
[listed here](#plugins).

### Adding plugins

To use a plugin, please install it, then pass it to
[`modernErrors()`](#modernerrorsplugins-options)'s first argument.

```bash
npm install modern-errors-{pluginName}
```

<!-- eslint-disable import/order -->

```js
import modernErrors from 'modern-errors'

import modernErrorsBugs from 'modern-errors-bugs'
import modernErrorsSerialize from 'modern-errors-serialize'

export const AnyError = modernErrors([modernErrorsBugs, modernErrorsSerialize])
```

### Plugin options

Most plugins can be configured with options. The option's name is the same as
the plugin.

```js
const options = {
  // `modern-error-bugs` options
  bugs: 'https://github.com/my-name/my-project/issues',
  // `props` can be configured and modified like plugin options
  props: { userId: 5 },
}
```

Plugin options can apply to (in priority order):

- Any error: second argument to [`modernErrors()`](#modernerrorsplugins-options)

```js
export const AnyError = modernErrors(plugins, options)
```

- Any error of multiple classes: using `ErrorClass.subclass()`

```js
export const SharedError = AnyError.subclass('SharedError', options)

export const InputError = SharedError.subclass('InputError')
export const AuthError = SharedError.subclass('AuthError')
```

- Any error of a specific class: second argument to
  [`AnyError.subclass()`](#anyerrorsubclassname-options)

```js
export const InputError = AnyError.subclass('InputError', options)
```

- A specific error: second argument to the error's constructor

```js
throw new InputError('...', options)
```

- A plugin method call: last argument, passing only that plugin's options

```js
AnyError[methodName](...args, options[pluginName])
```

```js
error[methodName](...args, options[pluginName])
```

### Custom plugins

Please see the [following documentation](docs/plugins.md) to create your own
plugin.

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
