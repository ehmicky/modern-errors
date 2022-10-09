# Clean stack traces

_Plugin_:
[`modern-errors-stack`](https://github.com/ehmicky/modern-errors-stack) (Node.js
only)

This plugin
[cleans up stack traces](https://github.com/sindresorhus/clean-stack) by:

- Shortening file paths, making them relative to the current directory
- Replacing the home directory with `~`
- Removing unhelpful internal Node.js entries

Before:

```
Error: message
    at exampleFunction (/home/ehmicky/repo/dev/example.js:7:2)
    at main (/home/ehmicky/repo/dev/main.js:2:15)
    at Module._compile (module.js:409:26)
    at Object.Module._extensions..js (module.js:416:10)
    at Module.load (module.js:343:32)
    at Function.Module._load (module.js:300:12)
    at Function.Module.runMain (module.js:441:10)
    at startup (node.js:139:18)
```

After:

```
Error: message
    at exampleFunction (dev/example.js:7:2)
    at main (dev/main.js:2:15)
```
