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

Error handling framework that is minimalist yet featureful.

# Features

- Create [custom error types](#create-custom-error-types)
- Handle errors from both [programmatic](#error-handler) and [CLI](#cli-errors)
  modules
- Wrap inner errors' [message](#wrap-error-message), [type](#set-error-type), or
  [properties](#wrap-error-properties)
- Automatically separate (unhandled) [internal errors](#internal-errors) from
  (handled) user errors
- Internal errors indicate where to [report bugs](#bug-reports)
- [Serialize/parse](#serializationparsing) errors
- Set properties on [individual errors](#set-error-properties), or on
  [all errors of the same type](#error-type-properties)
- Handle [invalid errors](#invalid-errors) (not an `Error` instance, missing
  stack, etc.)

# Example

Create custom error types.

```js
// `error.js`
import modernErrors from 'modern-errors'

export const { InputError, AuthError, DatabaseError, errorHandler, parse } =
  modernErrors(['InputError', 'AuthError', 'DatabaseError'])
```

Wrap the main function with the error handler.

```js
import { errorHandler } from './error.js'

export const main = async function (filePath) {
  try {
    return await readContents(filePath)
  } catch (error) {
    throw errorHandler(error)
  }
}
```

Throw/re-throw errors.

```js
import { InputError } from './error.js'

const readContents = async function (filePath) {
  try {
    return await readFile(filePath)
  } catch (cause) {
    throw new InputError(`Could not read ${filePath}`, { cause })
  }
}
```

# Install

```bash
npm install modern-errors
```

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## modernErrors(errorNames, options?)

`errorNames` `string[]`\
[`options` `object`](#options)\
[_Return value_: `object`](#return-value)

Creates custom [error types](#any-error-type).

### Return value

#### Any error type

_Type_: `ErrorType`

Any error name passed as argument is returned as an error type.

#### errorHandler

_Type_: `(anyException) => Error`

Error handler that [should wrap each main function](#error-handler).

#### parse

_Type_: `(errorObject) => Error`

Convert an [error plain object](#serialize) into [an Error instance](#parse-1).

### Options

#### bugsUrl

_Type_: `string | URL`

URL where users should [report internal errors/bugs](#bug-reports).

#### onCreate

_Type_: `(error, parameters) => void`

Called on any [`new ErrorType('message', parameters)`](#set-error-properties).
Can be used to [customize error parameters](#customize-error-parameters) or set
[error type properties](#error-type-properties). By default, any `parameters`
are [set as error properties](#set-error-properties).

# Usage

## Setup

### Create custom error types

```js
// error.js
import modernErrors from 'modern-errors'

export const { InputError, AuthError, DatabaseError, errorHandler, parse } =
  modernErrors(['InputError', 'AuthError', 'DatabaseError'])
```

### Error handler

Each main function should be wrapped with the [`errorHandler()`](#errorhandler).

```js
import { errorHandler } from './error.js'

export const main = async function (filePath) {
  try {
    return await readContents(filePath)
  } catch (error) {
    // `errorHandler()` returns `error`, so `throw` must be used
    throw errorHandler(error)
  }
}
```

## Throw errors

### Simple errors

```js
import { InputError } from './error.js'

const validateFilePath = function (filePath) {
  if (filePath === '') {
    throw new InputError('Missing file path.')
  }
}
```

### Invalid errors

Invalid errors [are normalized](https://github.com/ehmicky/normalize-exception)
by [`errorHandler()`](#error-handler). This includes errors that are not an
[`Error` instance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
or that have
[wrong/missing properties](https://github.com/ehmicky/normalize-exception#features).

<!-- eslint-disable no-throw-literal -->

```js
import { errorHandler } from './error.js'

export const main = function (filePath) {
  try {
    throw 'Missing file path.'
  } catch (error) {
    throw errorHandler(error) // Normalized to an `Error` instance
  }
}
```

### Re-throw errors

Errors are re-thrown using the
[standard `cause` parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause).
This allows wrapping the error [message](#wrap-error-message),
[properties](#wrap-error-properties), or [type](#set-error-type).

```js
import { InputError } from './error.js'

const readContents = async function (filePath) {
  try {
    return await readFile(filePath)
  } catch (cause) {
    throw new InputError(`Could not read ${filePath}`, { cause })
  }
}
```

The [`errorHandler()`](#error-handler)
[merges all error `cause`](https://github.com/ehmicky/merge-error-cause) into a
single error, including their
[`message`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message),
[`stack`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack),
[`name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name),
[`AggregateError.errors`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
and any [additional property](#set-error-properties). This ensures:

- `error.cause` does not need to be
  [traversed](https://github.com/ehmicky/merge-error-cause#traversing-errorcause)
- The stack trace is neither
  [verbose nor redundant](https://github.com/ehmicky/merge-error-cause#verbose-stack-trace),
  while still keeping all information

### Wrap error message

The outer error message is appended.

```js
try {
  await readFile(filePath)
} catch (cause) {
  throw new InputError(`Could not read ${filePath}`, { cause })
  // InputError: File does not exist.
  // Could not read /example/path
}
```

If the outer error message ends with `:`, it is prepended instead.

```js
throw new InputError(`Could not read ${filePath}:`, { cause })
// InputError: Could not read /example/path: File does not exist.
```

`:` can optionally be followed a newline.

```js
throw new InputError(`Could not read ${filePath}:\n`, { cause })
// InputError: Could not read /example/path:
// File does not exist.
```

## Error types

### Test error type

Once [`errorHandler()`](#error-handler) has been applied, the error type can be
checked by its `name`. Libraries should document their possible error names, but
do not need to `export` their error types.

```js
if (error.name === 'InputError') {
  // ...
} else if (error.name === 'InternalError') {
  // ...
}
```

### Set error type

When [re-throwing errors](#re-throw-errors), the outer error type overrides the
inner one.

```js
try {
  throw new AuthError('Could not authenticate.')
} catch (cause) {
  throw new InputError('Could not read the file.', { cause })
  // Now an InputError
}
```

However, the inner error type is kept if the outer one is `Error` or
[`AggregateError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError).

```js
try {
  throw new AuthError('Could not authenticate.')
} catch (cause) {
  throw new Error('Could not read the file.', { cause })
  // Still an AuthError
}
```

### Internal errors

Internal errors/bugs can be distinguished from user errors by:

- [Handling any possible errors](#re-throw-errors) in `try {} catch {}`
- Re-throwing them [with a known error type](#set-error-type)

The [`errorHandler()`](#error-handler) assigns the `InternalError` type to any
error with an unknown type.

<!-- eslint-disable unicorn/no-null -->

```js
const getUserId = function (user) {
  return user.id
}

getUserId(null) // InternalError: Cannot read properties of null (reading 'id')
```

### Bug reports

If the [`bugsUrl` option](#bugsurl) is used,

```js
modernErrors({ bugsUrl: 'https://github.com/my-name/my-project/issues' })
```

any [internal error](#internal-errors) will include the following message.

```
Please report this bug at: https://github.com/my-name/my-project/issues
```

## Error properties

### Set error properties

Unless the [`onCreate()` option](#oncreate) is defined, any parameter is set as
an error property.

```js
const error = new InputError('Could not read the file.', { filePath: '/path' })
console.log(error.filePath) // '/path'
```

### Wrap error properties

Pass an empty `message` in order to set error properties without wrapping the
`message`.

<!-- eslint-disable unicorn/error-message -->

```js
try {
  await readFile(filePath)
} catch (cause) {
  throw new Error('', { cause, filePath: '/path' })
}
```

### Customize error parameters

The [`onCreate()` option](#oncreate) can be used to validate and transform error
`parameters`.

<!-- eslint-disable fp/no-mutating-assign, unicorn/prefer-type-error -->

```js
modernErrors({
  onCreate(error, parameters) {
    const { filePath } = parameters

    if (typeof filePath !== 'string') {
      throw new Error('filePath must be a string.')
    }

    const hasFilePath = filePath !== undefined
    Object.assign(error, { filePath, hasFilePath })
  },
})
```

```js
const error = new InputError('Could not read the file.', {
  filePath: '/path',
  unknownParam: true,
})
console.log(error.filePath) // '/path'
console.log(error.hasFilePath) // true
console.log(error.unknownParam) // undefined
```

### Type-specific logic

The [`onCreate()` option](#oncreate) can trigger error type-specific logic.

<!-- eslint-disable n/handle-callback-err -->

```js
modernErrors({
  onCreate(error, parameters) {
    onCreateError[error.name](error, parameters)
  },
})

const onCreateError = {
  InputError(error, parameters) {
    // ...
  },
  AuthError(error, parameters) {
    // ...
  },
  // ...
}
```

### Error type properties

The [`onCreate()` option](#oncreate) can be used to set properties on all
instances of a given error type.

<!-- eslint-disable fp/no-mutating-assign -->

```js
modernErrors({
  onCreate(error, parameters) {
    Object.assign(error, parameters, ERROR_PROPS[error.name])
  },
})

const ERROR_PROPS = {
  InputError: { isUser: true },
  AuthError: { isUser: true },
  DatabaseError: { isUser: false },
}
```

```js
const error = new InputError('Could not read the file.')
console.log(error.isUser) // true
```

## CLI errors

CLI applications can assign a different exit code and log verbosity per error
type by using [`handle-cli-error`](https://github.com/ehmicky/handle-cli-error).

```js
#!/usr/bin/env node
import handleCliError from 'handle-cli-error'

// `programmaticMain()` must use `modern-errors`'s `errorHandler`
import programmaticMain from './main.js'

const cliMain = function () {
  try {
    const cliFlags = getCliFlags()
    programmaticMain(cliFlags)
  } catch (error) {
    // Print `error` then exit the process
    handleCliError(error, {
      types: {
        InputError: { exitCode: 1, short: true },
        DatabaseError: { exitCode: 2, short: true },
        default: { exitCode: 3 },
      },
    })
  }
}

cliMain()
```

## Serialization/parsing

### Serialize

`error.toJSON()` converts errors to plain objects that
[can be serialized](https://github.com/ehmicky/error-serializer#json-safety) to
JSON
([or YAML](https://github.com/ehmicky/error-serializer#custom-serializationparsing),
etc.). All error properties
[are kept](https://github.com/ehmicky/error-serializer#additional-error-properties),
including
[`cause`](https://github.com/ehmicky/error-serializer#errorcause-and-aggregateerror).

```js
try {
  await readFile(filePath)
} catch (cause) {
  const error = new InputError('Could not read the file.', {
    cause,
    filePath: '/path',
  })
  const errorObject = error.toJSON()
  // {
  //   name: 'InputError',
  //   message: 'Could not read the file',
  //   stack: '...',
  //   cause: { name: 'Error', ... },
  //   filePath: '/path'
  // }
  const errorString = JSON.stringify(error)
  // '{"name":"InputError",...}'
}
```

### Parse

[`parse(errorObject)`](#parse) converts those error plain objects back to
identical error instances.

```js
const newErrorObject = JSON.parse(errorString)
const newError = parse(newErrorObject)
// InputError: Could not read the file.
//   filePath: '/path'
//   [cause]: Error: ...
```

### Deep serialization/parsing

Objects and arrays containing custom errors can be deeply serialized to JSON.
They can then be deeply parsed back using
[`JSON.parse()`'s reviver](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#using_the_reviver_parameter).

```js
const error = new InputError('Could not read the file.')
const deepObject = [{}, { error }]
const jsonString = JSON.stringify(deepObject)
const newDeepObject = JSON.parse(jsonString, (key, value) => parse(value))
console.log(newDeepObject[1].error) // InputError: Could not read the file.
```

# Modules

This framework brings together a collection of modules which can also be used
individually:

- [`create-error-types`](https://github.com/ehmicky/create-error-types): Create
  multiple error types
- [`error-type`](https://github.com/ehmicky/error-type): Create one error type
- [`error-serializer`](https://github.com/ehmicky/error-serializer): Convert
  errors to/from plain objects
- [`normalize-exception`](https://github.com/ehmicky/normalize-exception):
  Normalize exceptions/errors
- [`merge-error-cause`](https://github.com/ehmicky/merge-error-cause): Merge an
  error with its `cause`
- [`error-cause-polyfill`](https://github.com/ehmicky/error-cause-polyfill):
  Polyfill `error.cause`
- [`handle-cli-error`](https://github.com/ehmicky/handle-cli-error): 💣 Error
  handler for CLI applications 💥

# Related projects

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
