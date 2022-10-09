# Error logging (Winston)

_Plugin_:
[`modern-errors-winston`](https://github.com/ehmicky/modern-errors-winston)
(Node.js only)

Errors can be logged with [Winston](https://github.com/winstonjs/winston) using
[`winston.error(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).

## Formats

### Full

The logger
[`format`](https://github.com/winstonjs/winston/blob/master/README.md#formats)
must be `AnyError.fullFormat()`
[combined](https://github.com/winstonjs/winston#combining-formats) with
[`format.json()`](https://github.com/winstonjs/logform#json) or
[`format.prettyPrint()`](https://github.com/winstonjs/logform#prettyprint). This
logs all error properties, making it useful with
[transports](https://github.com/winstonjs/winston#transports) like
[HTTP](https://github.com/winstonjs/winston/blob/master/docs/transports.md#http-transport).

```js
import { createLogger, transports, format } from 'winston'

const logger = createLogger({
  transports: [new transports.Http(httpOptions)],
  format: format.combine(AnyError.fullFormat(), format.json()),
})

const error = new InputError('Could not read file.', { props: { filePath } })
logger.error(error)
// Sent via HTTP:
// {
//   level: 'error',
//   name: 'InputError',
//   message: 'Could not read file.',
//   stack: `InputError: Could not read file.
//     at ...`,
//   filePath: '/...',
// }
```

### Short

Alternatively, `AnyError.shortFormat()` can be used instead
[combined](https://github.com/winstonjs/winston#combining-formats) with
[`format.simple()`](https://github.com/winstonjs/logform#simple) or
[`format.cli()`](https://github.com/winstonjs/logform#cli). This logs only the
error name, message and stack, making it useful with
[transports](https://github.com/winstonjs/winston#transports) like the
[console](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport).

```js
const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(AnyError.shortFormat(), format.cli()),
})

const error = new InputError('Could not read file.', { props: { filePath } })
logger.error(error)
// error:   InputError: Could not read file.
//     at ...
```

## Options

### level

_Type_: `string`\
_Default_: `error`

Log [level](https://github.com/winstonjs/winston#logging-levels).

### stack

_Type_: `boolean`

Whether to log the stack trace.

By default, this is `true` if the error (or one of its
[inner](https://github.com/ehmicky/modern-errors/README.md#wrap-errors) errors)
is
[_unknown_](https://github.com/ehmicky/modern-errors/README.md#unknown-errors),
and `false` otherwise.
