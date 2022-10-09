# CLI errors

_Plugin_: [`modern-errors-cli`](https://github.com/ehmicky/modern-errors-cli)
(Node.js only)

`error.exit()` logs `error` on the console then exits the process.

```js
import { AnyError } from './errors.js'

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

### exitCode

_Type_: `integer`

Process [exit code](https://en.wikipedia.org/wiki/Exit_status).

By default, each error class has its own exit code: `1` for the first one
declared, `2` for the next one, and so on.

### short

_Type_: `boolean`

Logs the `error` message only, not its stack trace.

By default, this is `false` if the error (or one of its
[inner](https://github.com/ehmicky/modern-errors/README.md#re-throw-errors)
errors) is
[_unknown_](https://github.com/ehmicky/modern-errors/README.md#unknown-errors),
and `true` otherwise.

### silent

_Type_: `boolean`\
_Default_: `false`

Exits the process without logging anything on the console.

### timeout

_Type_: `integer` (in milliseconds)\
_Default_: `5000` (5 seconds)

The process exits gracefully: it waits for any ongoing tasks (callbacks,
promises, etc.) to complete, up to a specific `timeout`.

Special values:

- `0`: Exits right away, without waiting for ongoing tasks
- `Number.POSITIVE_INFINITY`: Waits for ongoing tasks forever, without timing
  out
