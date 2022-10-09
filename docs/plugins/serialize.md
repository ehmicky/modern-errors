# Serialization/parsing

_Plugin_:
[`modern-errors-serialize`](https://github.com/ehmicky/modern-errors-serialize)

## Serialize

`error.toJSON()` converts errors to plain objects that are
[serializable](https://github.com/ehmicky/error-serializer#json-safety) to JSON
([or YAML](https://github.com/ehmicky/error-serializer#custom-serializationparsing),
etc.). It is
[automatically called](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior)
by `JSON.stringify()`. All error properties
[are kept](https://github.com/ehmicky/error-serializer#additional-error-properties).

```js
const error = new InputError('Wrong file.', { props: { filePath } })
const errorObject = error.toJSON()
// { name: 'InputError', message: 'Wrong file', stack: '...', filePath: '...' }
const errorString = JSON.stringify(error)
// '{"name":"InputError",...}'
```

## Parse

`AnyError.parse(errorObject)` converts those error plain objects back to
identical error instances. The original error class is preserved.

```js
const newErrorObject = JSON.parse(errorString)
const newError = AnyError.parse(newErrorObject)
// InputError: Wrong file.
//     at ...
//   filePath: '...'
```

## Deep serialization/parsing

Objects and arrays are deeply serialized and parsed.

```js
const error = new InputError('Wrong file.')
const deepArray = [{}, { error }]

const jsonString = JSON.stringify(deepArray)
const newDeepArray = JSON.parse(jsonString)

const newError = AnyError.parse(newDeepArray)[1].error
// InputError: Wrong file.
//     at ...
```
