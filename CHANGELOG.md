# 5.0.0

## Breaking changes

### Top-level error class

The default export is now the top-level error class
[`ModernError`](README.md#modernerror).

Also, the base error class is now documented as
[`BaseError`](README.md#create-error-classes) instead of `AnyError`.

Before:

```js
import modernErrors from 'modern-errors'

export const AnyError = modernErrors(plugins, options)
```

After:

```js
import ModernError from 'modern-errors'

export const BaseError = ModernError.subclass('BaseError', {
  ...options,
  plugins,
})
```

### Error normalization

Creating an `UnknownError` class is now optional, although still recommended. To
normalize unknown errors, `UnknownError` must now be explicitly passed as a
second argument to
[`BaseError.normalize()`](README.md#errorclassnormalizeerror-newerrorclass).

Before:

```js
export const main = function () {
  try {
    // ...
  } catch (error) {
    throw BaseError.normalize(error)
  }
}
```

After:

```js
export const main = function () {
  try {
    // ...
  } catch (error) {
    throw BaseError.normalize(error, UnknownError)
  }
}
```

When `UnknownError` is not passed as a second argument, `BaseError.normalize()`
now converts unknown errors to `BaseError` instances instead.

Before:

```js
const error = new Error('example')
assert(BaseError.normalize(error) instanceof UnknownError)
```

After:

```js
const error = new Error('example')
assert(BaseError.normalize(error) instanceof BaseError)
assert(!(BaseError.normalize(error) instanceof UnknownError))
assert(BaseError.normalize(error, UnknownError) instanceof UnknownError)
```

### Wrap error options

When wrapping errors, the outer and inner error's options are
[now always merged](README.md#wrap-error-options).

Before:

```js
try {
  throw new AuthError('...', innerOptions)
} catch (cause) {
  // Options are now `outerOptions`. `innerOptions` are discarded.
  throw new InputError('...', { ...outerOptions, cause })
}
```

After:

```js
try {
  throw new AuthError('...', innerOptions)
} catch (cause) {
  // `outerOptions` are merged with `innerOptions`
  throw new InputError('...', { ...outerOptions, cause })
}
```

### Wrap error class

When wrapping errors, the inner error's
[class is now kept](README.md#wrap-error-class) if the outer error's class is a
parent (including `BaseError`).

```js
export const ParentError = BaseError.subclass('ParentError')
export const ChildError = ParentError.subclass('ChildError')
```

Before:

```js
try {
  throw new ChildError('...')
} catch (cause) {
  // Now a ParentError
  throw new ParentError('...', { cause })
}
```

After:

```js
try {
  throw new ChildError('...')
} catch (cause) {
  // Still a ChildError, because that is a subclass of ParentError
  throw new ParentError('...', { cause })
}
```

### Aggregate errors

[Aggregate errors](README.md#aggregate-errors) must now be explicitly
[normalized](README.md#-normalize-errors) by
[`BaseError.normalize()`](README.md#errorclassnormalizeerror-newerrorclass)
instead of being automatically normalized on creation.

## Features

### Global custom logic

Global [custom logic](README.md#class-custom-logic) can now be specified by
passing the [`custom` option](README.md#optionscustom) to the
[`BaseError`](README.md#errorclasssubclassname-options). Previously, only
class-specific custom logic could be specified.

### Class-specific plugins

[Plugins](README.md#-plugins) can now be specific to an error class (and its
subclasses) by using the [`plugins` option](README.md#optionsplugins).

### Optional wrapping

The `BaseError` can now be instantiating without
[wrapping an error](README.md#-wrap-errors). The
[`cause` option](README.md#optionscause) is not required anymore.

### Missing stack trace

Improve the stack trace produced when wrapping an error that does not have one.

## Plugins

The following changes only impact [custom plugin](docs/plugins.md) authors.

### `info.ErrorClass`

[Static methods](docs/plugins.md#staticmethodsmethodname) (including
[`ErrorClass.normalize()`](README.md#errorclassnormalizeerror-newerrorclass))
can now be called on any error class, not only on `BaseError`. As a consequence,
`info.AnyError` has been renamed to
[`info.ErrorClass`](docs/plugins.md#errorclass).

### `info.ErrorClasses`

[`info.ErrorClasses`](docs/plugins.md#errorclasses) is now an array instead of
an object. This array might contain error classes with duplicate names.

### `info.errorInfo`

[`info.errorInfo(error)`](docs/plugins.md#errorinfo) now returns the error's
[`ErrorClass`](docs/plugins.md#errorclass) and
[`ErrorClasses`](docs/plugins.md#errorclasses).

# 4.1.1

## Bug fixes

- Improve how stack traces are printed

# 4.1.0

## Features

- Add browser support

# 4.0.0

## Major features

### Plugins

Features can now be extended using [plugins](README.md#plugins).

<!-- eslint-disable import/order -->

```js
import modernErrors from 'modern-errors'

import modernErrorsBugs from 'modern-errors-bugs'
import modernErrorsCli from 'modern-errors-cli'

export const AnyError = modernErrors([modernErrorsBugs, modernErrorsCli])
```

### CLI plugin

The [`modern-errors-cli` plugin](https://github.com/ehmicky/modern-errors-cli)
handles CLI errors.

### Process errors

The
[`modern-errors-process` plugin](https://github.com/ehmicky/modern-errors-process)
handles process errors.

### Clean stack traces

The
[`modern-errors-stack` plugin](https://github.com/ehmicky/modern-errors-stack)
automatically cleans up stack traces.

### HTTP responses

The [`modern-errors-http` plugin](https://github.com/ehmicky/modern-errors-http)
converts errors to plain objects to use in an HTTP response.

### Error logging (Winston)

The
[`modern-errors-winston` plugin](https://github.com/ehmicky/modern-errors-winston)
logs errors with Winston.

### Subclasses

Error subclasses can now be created using
[`ErrorClass.subclass()`](README.md#shared-custom-logic) to share custom logic
and options between classes.

<!-- eslint-disable fp/no-this -->

```js
const SharedError = AnyError.subclass('SharedError', {
  custom: class extends AnyError {
    // ...
  },
})

export const InputError = SharedError.subclass('InputError')
export const AuthError = SharedError.subclass('AuthError')
```

### Improved options

Options can now be applied to [any error](README.md#configure-options).

```js
export const AnyError = modernErrors(plugins, options)
```

Or to any error of a specific class.

```js
export const InputError = AnyError.subclass('InputError', options)
```

Or to multiple classes.

```js
export const SharedError = AnyError.subclass('SharedError', options)

export const InputError = SharedError.subclass('InputError')
export const AuthError = SharedError.subclass('AuthError')
```

Or to a specific error.

```js
throw new InputError('...', options)
```

Or to a specific plugin method call, passing only that plugin's options.

```js
AnyError[methodName](...args, options[pluginName])
```

```js
error[methodName](...args, options[pluginName])
```

### Aggregate errors

The [`errors` option](README.md#aggregate-errors) can now be used to aggregate
multiple errors into one, similarly to `new AggregateError(errors)`.

## Breaking changes

### Creating error classes

The [main function](README.md#modernerrorsplugins-options) now returns the base
error class [`AnyError`](README.md#anyerror).

[`AnyError.subclass(name)`](README.md#anyerrorsubclassname-options) must be used
to create each error class. The first one must now be named
[`UnknownError`](README.md#-unknown-errors).

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

export const UnknownError = AnyError.subclass('UnknownError')
export const InputError = AnyError.subclass('InputError')
export const AuthError = AnyError.subclass('AuthError')
export const DatabaseError = AnyError.subclass('DatabaseError')
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

### Custom classes

Error classes can now be fully customized using the
[`custom` option](README.md#-custom-logic): constructors, methods, etc. This
replaces the previous `onCreate` option.

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
export const InputError = AnyError.subclass('InputError', {
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

### Error properties

Error properties must now be set using
[`props.{propName}`](README.md#error-instance-properties) instead of
`{propName}`.

Before:

```js
throw new InputError('...', { filePath: '/path' })
```

After:

```js
throw new InputError('...', { props: { filePath: '/path' } })
```

### Bug reports

The `bugsUrl` option has been renamed to
[`bugs`](https://github.com/ehmicky/modern-errors-bugs). It cannot be a function
anymore. It also requires adding the
[`modern-errors-bugs`](https://github.com/ehmicky/modern-errors-bugs)
[plugin](README.md#adding-plugins).

A few bug fixes related to using the `bugs` option twice have also been fixed.

Before:

```js
throw new InputError('...', {
  bugsUrl: 'https://github.com/my-name/my-project/issues',
})
```

After:

```js
throw new InputError('...', {
  bugs: 'https://github.com/my-name/my-project/issues',
})
```

### Serialization/parsing

`parse()` has been renamed to
[`AnyError.parse()`](https://github.com/ehmicky/modern-errors-serialize#anyerrorparseerrorobject).
`AnyError.parse()` and `error.toJSON()` also require adding the
[`modern-errors-serialize`](https://github.com/ehmicky/modern-errors-serialize)
[plugin](README.md#adding-plugins).

Serialization and parsing now
[recurse deeply](https://github.com/ehmicky/modern-errors-serialize#deep-serializationparsing)
over objects and arrays.

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
`bugs` are now [merged right away](README.md#wrap-inner-error), instead of when
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
[check error classes](README.md#check-error-classes).

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

[`AnyError`](README.md#anyerror) can now be used to check for
[any errors](README.md#check-error-classes) from a specific library.

```js
if (error instanceof AnyError) {
  // ...
}
```

### TypeScript types

TypeScript support has been greatly improved and is now fully tested. Most types
have changed: if you were using them, please check the new documentation
[here](docs/typescript.md).

### Exporting error classes

Error classes should now be exported to be re-used across modules.

### License

Switch to MIT license.

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
  [`UnknownError`](README.md#-unknown-errors)

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
