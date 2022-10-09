# Bug reports

_Plugin_: [`modern-errors-bugs`](https://github.com/ehmicky/modern-errors-bugs)

The `bugs` option appends a bug reports URL to error messages.

Although any error class can use it, it is especially useful with
[`UnknownError`](#unknown-errors).

```js
export const UnknownError = AnyError.subclass('UnknownError', {
  bugs: 'https://github.com/my-name/my-project/issues',
})

// UnknownError: Cannot read properties of null (reading 'trim')
// Please report this bug at: https://github.com/my-name/my-project/issues
```
