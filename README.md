<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors_dark.svg"/>
  <img alt="modern-errors logo" src="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors.svg" width="600"/>
</picture>

[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/modern-errors)
[![Browsers](https://img.shields.io/badge/-Browsers-808080?logo=firefox&colorA=404040)](https://unpkg.com/modern-errors?module)
[![TypeScript](https://img.shields.io/badge/-Typed-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/src/main.d.ts)
[![Codecov](https://img.shields.io/badge/-Tested%20100%25-808080?logo=codecov&colorA=404040)](https://codecov.io/gh/ehmicky/modern-errors)
[![Minified size](https://img.shields.io/bundlephobia/minzip/modern-errors?label&colorA=404040&colorB=808080&logo=webpack)](https://bundlephobia.com/package/modern-errors)
[![Mastodon](https://img.shields.io/badge/-Mastodon-808080.svg?logo=mastodon&colorA=404040&logoColor=9590F9)](https://fosstodon.org/@ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

Handle errors in a simple, stable, consistent way.

# Hire me

Please
[reach out](https://www.linkedin.com/feed/update/urn:li:activity:7018596298127781890/)
if you're looking for a Node.js API or CLI engineer (10 years of experience).
Most recently I have been [Netlify Build](https://github.com/netlify/build)'s
and [Netlify Plugins](https://www.netlify.com/products/build/plugins/)'
technical lead for 2.5 years. I am available for full-time remote positions in
either US or EU time zones.

# Features

Simple patterns to:

- ⛑️ Create error [classes](#create-error-classes)
- 🏷️ Set error [properties](#%EF%B8%8F-error-properties)
- 🎀 [Wrap](#-wrap-errors) or [aggregate](#aggregate-errors) errors
- 🐞 Separate known and [unknown](#-unknown-errors) errors

Stability:

- 🚨 [Normalize](#-normalize-errors) invalid errors
- 🛡️ 100% [test coverage](https://app.codecov.io/gh/ehmicky/modern-errors)
- 🤓 Strict [TypeScript types](docs/typescript.md)

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
- [`modern-errors-switch`](https://github.com/ehmicky/modern-errors-switch):
  Execute class-specific logic
- 🔌 Create your [own plugin](docs/plugins.md)

# Example

Create error [classes](#%EF%B8%8F-error-classes).

```js
import ModernError from 'modern-errors'

export const BaseError = ModernError.subclass('BaseError')

export const UnknownError = BaseError.subclass('UnknownError')
export const InputError = BaseError.subclass('InputError')
export const AuthError = BaseError.subclass('AuthError')
export const DatabaseError = BaseError.subclass('DatabaseError')
```

Set error [properties](#%EF%B8%8F-error-properties).

```js
throw new InputError('Invalid file path', { props: { filePath: '/...' } })
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
[browsers](https://raw.githubusercontent.com/ehmicky/dev-tasks/main/src/browserslist).

This is an ES module. It must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`. If TypeScript is used, it must be configured to
[output ES modules](https://www.typescriptlang.org/docs/handbook/esm-node.html),
not CommonJS.

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

Exporting and documenting all error classes allows consumers to check them. This
also enables sharing error classes between modules.

### Check error classes

```js
if (error instanceof InputError) {
  // ...
}
```

### Error subclasses

[`ErrorClass.subclass()`](#errorclasssubclassname-options) returns a
[subclass](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends).
Parent classes' [options](#options) are merged with their subclasses.

```js
export const BaseError = ModernError.subclass('BaseError', {
  props: { isError: true },
})
export const InputError = BaseError.subclass('InputError', {
  props: { isUserError: true },
})

const error = new InputError('...')
console.log(error.isError) // true
console.log(error.isUserError) // true
console.log(error instanceof BaseError) // true
console.log(error instanceof InputError) // true
```

## 🏷️ Error properties

### Error class properties

```js
const InputError = BaseError.subclass('InputError', {
  props: { isUserError: true },
})
const error = new InputError('...')
console.log(error.isUserError) // true
```

### Error instance properties

```js
const error = new InputError('...', { props: { isUserError: true } })
console.log(error.isUserError) // true
```

### Internal error properties

Error properties that are internal or secret can be prefixed with `_`. This
makes them
[non-enumerable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties),
which prevents iterating or logging them.

<!-- eslint-disable no-underscore-dangle -->

```js
const error = new InputError('...', {
  props: { userId: 6, _isUserError: true },
})
console.log(error.userId) // 6
console.log(error._isUserError) // true
console.log(Object.keys(error)) // ['userId']
console.log(error) // `userId` is logged, but not `_isUserError`
```

## 🎀 Wrap errors

### Throw errors

```js
throw new InputError('Missing file path.')
```

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
and any [additional property](#%EF%B8%8F-error-properties).

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

The outer error's [`props`](#%EF%B8%8F-error-properties) and
[plugin options](#plugin-options) are merged.

```js
try {
  throw new AuthError('...', innerOptions)
} catch (cause) {
  // `outerOptions` are merged with `innerOptions`
  throw new BaseError('...', { ...outerOptions, cause })
}
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

## 🚨 Normalize errors

### Wrapped errors

Any error can be directly passed to the [`cause`](#wrap-inner-error) or
[`errors`](#aggregate-errors) option, even if it is [invalid](#invalid-errors),
[unknown](#-unknown-errors) or not
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

## 🐞 Unknown errors

### Handling known errors

Known errors should be handled in a `try {} catch {}` block and
[wrapped](#wrap-error-class) with a [specific class](#create-error-classes).
That block should only cover the statement that might throw in order to prevent
catching other unrelated errors.

<!-- eslint-skip -->

```js
try {
  return regExp.test(value)
} catch (error) {
  // Now an `InputError` instance
  throw new InputError('Invalid regular expression:', { cause: error })
}
```

### Normalizing unknown errors

If an error is not handled as described [above](#handling-known-errors), it is
considered _unknown_. This indicates an unexpected exception, usually a bug.
[`BaseError.normalize(error, UnknownError)`](#errorclassnormalizeerror-newerrorclass)
assigns the `UnknownError` class to those errors.

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

### Top-level error handler

Wrapping a module's main functions with
[`BaseError.normalize(error, UnknownError)`](#errorclassnormalizeerror-newerrorclass)
ensures every error being thrown is [valid](#invalid-errors), applies
[plugins](#-plugins), and has a class that is either
[_known_](#create-error-classes) or [`UnknownError`](#-unknown-errors).

```js
export const main = () => {
  try {
    // ...
  } catch (error) {
    throw BaseError.normalize(error, UnknownError)
  }
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

### Custom plugins

Please see the [following documentation](docs/plugins.md) to create your own
plugin.

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

## 🔧 Custom logic

The [`custom` option](#optionscustom) can be used to provide an error `class`
with additional methods, `constructor`, properties or options.

<!-- eslint-disable no-param-reassign, fp/no-mutation,
     class-methods-use-this -->

```js
export const InputError = BaseError.subclass('InputError', {
  // The `class` must extend from the parent error class
  custom: class extends BaseError {
    // If a `constructor` is defined, its parameters must be (message, options)
    // Additional `options` can be defined.
    constructor(message, options) {
      message += options?.suffix ?? ''
      super(message, options)
    }

    isUserInput() {
      // ...
    }
  },
})

const error = new InputError('Wrong user name', { suffix: ': example' })
console.log(error.message) // 'Wrong user name: example'
console.log(error.isUserInput())
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

`error`: `Error | any`\
`NewErrorClass`: subclass of `ErrorClass`\
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
- [`wrap-error-message`](https://github.com/ehmicky/wrap-error-message):
  Properly wrap an error's message
- [`set-error-props`](https://github.com/ehmicky/set-error-props): Properly
  update an error's properties
- [`set-error-stack`](https://github.com/ehmicky/set-error-stack): Properly
  update an error's stack
- [`handle-cli-error`](https://github.com/ehmicky/handle-cli-error): 💣 Error
  handler for CLI applications 💥
- [`log-process-errors`](https://github.com/ehmicky/log-process-errors): Show
  some ❤ to Node.js process errors
- [`error-http-response`](https://github.com/ehmicky/error-http-response):
  Create HTTP error responses
- [`winston-error-format`](https://github.com/ehmicky/winston-error-format): Log
  errors with Winston

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
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://fosstodon.org/@ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4?s=100" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/modern-errors/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/modern-errors/commits?author=ehmicky" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/bhvngt"><img src="https://avatars.githubusercontent.com/u/79074469?v=4?s=100" width="100px;" alt="const_var"/><br /><sub><b>const_var</b></sub></a><br /><a href="#ideas-bhvngt" title="Ideas, Planning, & Feedback">🤔</a> <a href="#question-bhvngt" title="Answering Questions">💬</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/abrenneke"><img src="https://avatars.githubusercontent.com/u/342540?v=4?s=100" width="100px;" alt="Andy Brenneke"/><br /><sub><b>Andy Brenneke</b></sub></a><br /><a href="#ideas-abrenneke" title="Ideas, Planning, & Feedback">🤔</a> <a href="#question-abrenneke" title="Answering Questions">💬</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tgfisher4"><img src="https://avatars.githubusercontent.com/u/49082176?v=4?s=100" width="100px;" alt="Graham Fisher"/><br /><sub><b>Graham Fisher</b></sub></a><br /><a href="https://github.com/ehmicky/modern-errors/issues?q=author%3Atgfisher4" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/renzor-fist"><img src="https://avatars.githubusercontent.com/u/117486829?v=4?s=100" width="100px;" alt="renzor"/><br /><sub><b>renzor</b></sub></a><br /><a href="#question-renzor-fist" title="Answering Questions">💬</a> <a href="#ideas-renzor-fist" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/eugene1g"><img src="https://avatars.githubusercontent.com/u/147496?v=4?s=100" width="100px;" alt="Eugene"/><br /><sub><b>Eugene</b></sub></a><br /><a href="https://github.com/ehmicky/modern-errors/commits?author=eugene1g" title="Code">💻</a> <a href="https://github.com/ehmicky/modern-errors/issues?q=author%3Aeugene1g" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
