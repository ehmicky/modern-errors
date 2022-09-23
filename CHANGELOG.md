# 4.0.0

## Major features

### Plugins

Features can now be extended using [plugins](README.md#plugins).

<!-- eslint-disable import/order -->

```js
import modernErrors from 'modern-errors'

import modernErrorsBugs from 'modern-errors-bugs'
import modernErrorsProps from 'modern-errors-props'

export const AnyError = modernErrors([modernErrorsProps, modernErrorsBugs])
```

### Custom classes

Error classes can now be fully customized using the
[`custom` option](README.md#custom): constructors, methods, etc.

This replaces the previous `onCreate` option.

Before:

```js
modernErrors({
  onCreate(error, options) {
    const { filePath } = options

    if (typeof filePath !== 'string') {
      throw new TypeError('filePath must be a string.')
    }

    error.filePath = filePath
  },
})
```

After:

<!-- eslint-disable fp/no-this, fp/no-mutation -->

```js
export const InputError = AnyError.class('InputError', {
  custom: class extends AnyError {
    constructor(message, options = {}) {
      super(message, options)

      const { filePath } = options

      if (typeof filePath !== 'string') {
        throw new TypeError('filePath must be a string.')
      }

      this.filePath = filePath
    }
  },
})
```

### Subclasses

Error subclasses can now be created using
[`ErrorClass.class()`](README.md#shared-custom-logic) to share custom logic
between classes.

<!-- eslint-disable fp/no-this -->

```js
const SharedError = AnyError.class('SharedError', {
  custom: class extends AnyError {
    isUserInput() {
      return this.message.includes('user')
    }
  },
})

export const InputError = SharedError.class('InputError')
export const AuthError = SharedError.class('AuthError', {
  custom: class extends SharedError {
    isAuth() {
      return this.message.includes('auth')
    }
  },
})
```

### Improved options

Options can now be applied to
[all errors of a given class](README.md#error-class-options).

```js
export const InputError = AnyError.class('InputError', options)
```

Or to [multiple classes](README.md#error-class-options).

```js
export const SharedError = AnyError.class('SharedError', options)

export const InputError = SharedError.class('InputError')
export const AuthError = SharedError.class('AuthError')
```

Or to [individual errors](README.md#error-instance-options).

```js
throw new InputError('Could not read the file.', options)
```

## Breaking changes

### Creating error classes

The [main function](README.md#modernerrorsplugins-options) now returns the base
error class [`AnyError`](README.md#anyerror).

[`AnyError.class(name)`](README.md#anyerrorclassname-options) must be used to
create each error class. One of them must now be named
[`UnknownError`](README.md#unknown-errors).

Before:

```js
export const {
  // Custom error classes
  InputError,
  AuthError,
  DatabaseError,
  // Error handler
  errorHandler,
} = modernErrors(['InputError', 'AuthError', 'DatabaseError'])
```

After:

```js
// Base error class
export const AnyError = modernErrors()

export const UnknownError = AnyError.class('UnknownError')
export const InputError = AnyError.class('InputError')
export const AuthError = AnyError.class('AuthError')
export const DatabaseError = AnyError.class('DatabaseError')
```

### Error handler

`errorHandler()` has been renamed to
[`AnyError.normalize()`](README.md#anyerrornormalizeanyexception).

Before:

```js
const { errorHandler } = modernErrors(errorNames)

const normalizedError = errorHandler(error)
```

After:

```js
const AnyError = modernErrors()

const normalizedError = AnyError.normalize(error)
```

### Options

Although the first argument and return value of
[`modernErrors()`](README.md#modernerrorsplugins-options) have changed, the
second argument can still be used for global [options](README.md#options).

Before:

```js
export const { InputError, errorHandler } = modernErrors(['InputError'], {
  bugs: 'https://github.com/my-name/my-project/issues',
})
```

After:

```js
export const AnyError = modernErrors(plugins, {
  bugs: 'https://github.com/my-name/my-project/issues',
})
```

### Error properties

Error properties must now be set using the
[`props` option](README.md#error-properties). This also requires adding the
`modern-errors-props` [plugin](README.md#adding-plugins).

Before:

```js
throw new InputError('Could not read the file.', {
  filePath: '/path',
})
```

After:

```js
throw new InputError('Could not read the file.', {
  props: { filePath: '/path' },
})
```

### Bug reports

The `bugsUrl` option has been renamed to [`bugs`](README.md#bug-reports). It
cannot be a function anymore. This also requires adding the `modern-errors-bugs`
[plugin](README.md#adding-plugins).

Before:

```js
throw new InputError('Could not read the file.', {
  bugsUrl: 'https://github.com/my-name/my-project/issues',
})
```

After:

```js
throw new InputError('Could not read the file.', {
  bugs: 'https://github.com/my-name/my-project/issues',
})
```

### Parsing

`parse()` has been renamed to [`AnyError.parse()`](README.md#parse). This also
requires adding the `modern-errors-serialize`
[plugin](README.md#adding-plugins).

Before:

```js
const { parse } = modernErrors(errorNames)

const errorObject = JSON.parse(errorString)
const error = parse(errorObject)
```

After:

```js
import modernErrorsSerialize from 'modern-errors-serialize'

const AnyError = modernErrors([modernErrorsSerialize])

const errorObject = JSON.parse(errorString)
const error = AnyError.parse(errorObject)
```

### Error wrapping

To wrap an error without changing its class, [`AnyError`](README.md#anyerror)
must now be used instead of `Error`. When wrapping an error, its `cause` and
`bugs` are now [merged right away](README.md#re-throw-errors), instead of when
`AnyError.normalize()` is called.

Before:

```js
throw new Error('Could not read the file.', { cause })
```

After:

```js
throw new AnyError('Could not read the file.', { cause })
```

### Checking error classes

We now recommend using `instanceof` instead of `error.name` to
[check error classes](README.md#check-error-class).

Before:

```js
if (error.name === 'InputError') {
  // ...
}
```

After:

```js
if (error instanceof InputError) {
  // ...
}
```

### Exporting error classes

Error classes should now be exported to be re-used across modules.

### TypeScript types

Most TypeScript types have been removed, except the top-level function.

## Minor features

- [`AnyError`](README.md#anyerror) can now be used to check for
  [any errors](README.md#check-error-class) from a specific library
- How `error.cause` is merged has been improved

## Bug fixes

- Do not wrap an [`UnknownError`](README.md#unknown-errors) into another
  `UnknownError`
- Do not add the [`bugs` option](README.md#bug-reports) if it's already been
  added

# 3.1.1

## Bug fixes

- Fix the [`bugsUrl` option](README.md#bugsurl) when the error has a known type

# 3.1.0

## Features

- Allow the [`bugsUrl` option](README.md#bugsurl) to
  [be a function](README.md#bug-reports)

# 3.0.0

## Breaking changes

- The `InternalError` type has been renamed to
  [`UnknownError`](README.md#unknown-errors)

# 2.0.2

## Bug fixes

- Fix TypeScript types of `parse()`

# 2.0.1

## Bug fixes

- Fix TypeScript types

# 2.0.0

## Breaking changes

- The error names must now be
  [passed as argument](README.md#modernerrorserrornames-options)

# 1.5.0

## Features

- [Serialize/parse](README.md#serializationparsing) errors

# 1.4.1

## Bug fixes

- Fix using the `in` operator on the return value

# 1.4.0

## Features

- Reduce npm package size

# 1.3.0

## Documentation

- Add documentation about [CLI errors](./README.md#cli-errors)

# 1.2.0

## Features

- Improve error normalization
