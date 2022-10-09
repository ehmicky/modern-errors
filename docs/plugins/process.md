# Process errors

_Plugin_:
[`modern-errors-process`](https://github.com/ehmicky/modern-errors-process)
(Node.js only)

`AnyError.logProcess()` improves process errors:
[uncaught](https://nodejs.org/api/process.html#process_event_uncaughtexception)
exceptions,
[unhandled](https://nodejs.org/api/process.html#process_event_unhandledrejection)
promises, promises
[handled too late](https://nodejs.org/api/process.html#process_event_rejectionhandled)
and [warnings](https://nodejs.org/api/process.html#process_event_warning).

It adds the following features:

- Stack traces for warnings and
  [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled)
- [Single event handler](#onerror) for all process errors
- Set any process error's class to
  [`UnknownError`](https://github.com/ehmicky/modern-errors/README.md#unknown-errors)
- Ignore [duplicate](#onerror) process errors
- [Normalize](#error) invalid errors
- [Process exit](#exit) is graceful and can be prevented

It returns a function to restore Node.js default behavior.

```js
import { AnyError } from './errors.js'

const restore = AnyError.logProcess()
restore()
```

## Options

### exit

_Type_: `boolean`

Whether to exit the process on
[uncaught exceptions](https://nodejs.org/api/process.html#process_event_uncaughtexception)
or
[unhandled promises](https://nodejs.org/api/process.html#process_event_unhandledrejection).

This is `false` by default if other libraries are listening to those events, so
they can perform the exit instead. Otherwise, this is `true`.

If some tasks are still ongoing, the exit waits for them to complete up to 3
seconds.

### onError

_Type_: `(error, event) => Promise<void> | void`\
_Default_: `console.error(error)`

Function called once per process error. Duplicate process errors are ignored.

#### error

_Type_:
[`UnknownError`](https://github.com/ehmicky/modern-errors/README.md#unknown-errors)

The process error. This is guaranteed to be a
[normalized](https://github.com/ehmicky/normalize-exception)
[`UnknownError`](https://github.com/ehmicky/modern-errors/README.md#unknown-errors)
instance. A short description of the [event](#event) is also appended to its
message.

#### event

_Type_: `string`

Process event name among:
[`'uncaughtException'`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
[`'unhandledRejection'`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`'rejectionHandled'`](https://nodejs.org/api/process.html#process_event_rejectionhandled),
[`'warning'`](https://nodejs.org/api/process.html#process_event_warning).
