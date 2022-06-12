[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/modern-errors.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/modern-errors)
[![Build](https://github.com/ehmicky/modern-errors/workflows/Build/badge.svg)](https://github.com/ehmicky/modern-errors/actions)
[![Node](https://img.shields.io/node/v/modern-errors.svg?logo=node.js)](https://www.npmjs.com/package/modern-errors)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

Handle errors like it's 2022.

<!--

# Features

- [Simple API](#api)
- Follows [best practices](https://github.com/ehmicky/error-type#best-practices)
- Error initialization parameters [are automatically set](#oncreate):
  `new CustomError('message', { exampleProp: true })`
- Polyfills
  [`error.cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)
  on
  [older Node.js and browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause#browser_compatibility)
- Optional [custom initialization logic](#oncreate)

-->

# Example

Create the error types and error handler.

```js
// `error.js`
import modernErrors from 'modern-errors'

export const { errorHandler, InputError, AuthError, DatabaseError } =
  modernErrors()
```

Wrap each main function with the error handler.

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

Throw errors.

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

## modernErrors(options?)

[`options` `object`](#options)\
[_Return value_: `object`](#return-value)

### Options

#### bugsUrl

_Type_: `string | URL`

#### onCreate

_Type_: `(error, params) => void`

This is called on `new ErrorType('message', params)`.

By default, it sets any `params` as error properties. However, you can override
it with any custom logic to validate, normalize params, etc.

### Return value

#### errorHandler

_Type_: `(anyException) => Error`

#### Any error type

_Type_: `ErrorType`

# Usage

## Creating error types and handler

```js
// error.js
import modernErrors from 'modern-errors'

export const { errorHandler, InputError, AuthError, DatabaseError } =
  modernErrors()
```

## Error handler

Each main function should be wrapped with the error handler.

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

The `errorHandler`
[normalizes the `error`](https://github.com/ehmicky/normalize-exception) if it
is not an `Error` instance or has invalid/missing error properties.

## Throwing errors

```js
import { InputError } from './error.js'

const validateFilePath = function (filePath) {
  if (filePath === '') {
    throw new InputError('Missing file path')
  }
}
```

## Wrapping errors

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

The `errorHandler`
[merges all error `cause`](https://github.com/ehmicky/merge-error-cause) to
prevent:

- [Verbose stack traces](https://github.com/ehmicky/merge-error-cause#verbose-stack-trace)
- Having to
  [traverse `error.cause`](https://github.com/ehmicky/merge-error-cause#traversing-errorcause)
  when catching `error`

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
