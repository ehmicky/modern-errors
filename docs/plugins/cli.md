# CLI errors

_Plugin_: [`modern-errors-cli`](https://github.com/ehmicky/modern-errors-cli)
(Node.js only)

`error.exit()` logs `error` on the console (`stderr`) then exits the process.

This never throws. Invalid errors are silently
[normalized](https://github.com/ehmicky/normalize-exception).

```js
const cliMain = function () {
  try {
    // ...
  } catch (error) {
    const normalizedError = AnyError.normalize(error)
    normalizedError.exit()
  }
}

cliMain()
```

## Options

### 🚨 exitCode

_Type_: `integer`

Process [exit code](https://en.wikipedia.org/wiki/Exit_status).

By default, each error class has its own exit code: `1` for the first one
declared, `2` for the next one, and so on.

### 📕 stack

_Type_: `boolean`

Whether to log the error's stack trace.

By default, this is `true` if the error (or one of its
[inner](https://github.com/ehmicky/modern-errors/README.md#wrap-errors) errors)
is
[_unknown_](https://github.com/ehmicky/modern-errors/README.md#unknown-errors),
and `false` otherwise.

### 📢 props

_Type_: `boolean`\
_Default_: `true`

Whether to log the error's additional properties.

### 🔕 silent

_Type_: `boolean`\
_Default_: `false`

Exits the process without logging anything on the console.

### 🖍️ colors

_Type_: `boolean`\
_Default_: `true` in terminals, `false` otherwise

Whether to colorize the error's message, stack trace and additional properties.

Quoted strings in the error's message are printed in bold (for `"..."` and
`'...'`) and in italic (for `` `...` ``).

### ❌ icon

_Type_: `string`\
_Default_: `'cross'`

Icon prepended to the error's name. The available values are listed
[here](https://github.com/sindresorhus/figures/blob/main/readme.md#figures-1).
Can be disabled by passing an empty string.

### 💄 header

_Type_: `string`\
_Default_: `'red bold'`

Color/style of the error's [icon](#-icon) and name. The available values are
listed [here](https://github.com/ehmicky/chalk-string#available-styles). Several
styles can be specified by using spaces. Can be disabled by passing an empty
string.

### 🚒 timeout

_Type_: `integer` (in milliseconds)\
_Default_: `5000` (5 seconds)

The process exits gracefully: it waits for any ongoing tasks (callbacks,
promises, etc.) to complete, up to a specific `timeout`.

Special values:

- `0`: Exits right away, without waiting for ongoing tasks
- `Number.POSITIVE_INFINITY`: Waits for ongoing tasks forever, without timing
  out
