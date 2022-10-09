# HTTP responses

_Plugin_: [`modern-errors-http`](https://github.com/ehmicky/modern-errors-http)

`error.httpResponse()` converts `error` to a plain object to use in an HTTP
response. Its shape follows [RFC 7807](https://www.rfc-editor.org/rfc/rfc7807)
("problem details").

```js
const object = error.httpResponse()
// {
//   type: 'https://example.com/probs/auth',
//   status: 401,
//   title: 'AuthError',
//   detail: 'Could not authenticate.',
//   instance: '/users/62',
//   stack: `AuthError: Could not authenticate.
//     at ...`,
//   extra: { userId: 62 },
// }
```

## Options

### type

_Type_: `urlString`\
_Default_: `undefined`

URI identifying and documenting the error class. Ideally, each error class
[should set one](https://github.com/ehmicky/modern-errors/README.md#plugin-options).

### status

_Type_: `integer`\
_Default_: `undefined`

HTTP status code.

### title

_Type_: `string`\
_Default_: `error.name`

Error class name.

### detail

_Type_: `string`\
_Default_: `error.message`

Error description.

### instance

_Type_: `urlString`\
_Default_: `undefined`

URI identifying the value which errored.

### stack

_Type_: `string`\
_Default_: `error.stack`

Error stack trace. Can be set to an empty string.

### extra

_Type_: `object`\
_Default_: any additional `error` properties

Additional information. This is always
[safe to serialize as JSON](https://github.com/ehmicky/safe-json-value). Can be
set to an empty object.
