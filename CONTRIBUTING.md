# Contributions

🎉 Thanks for considering contributing to this project! 🎉

These guidelines will help you send a pull request.

If you're submitting an issue instead, please skip this document.

If your pull request is related to a typo or the documentation being unclear,
please click on the relevant page's `Edit` button (pencil icon) and directly
suggest a correction instead.

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Development process

First fork and clone the repository. If you're not sure how to do this, please
watch
[these videos](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

Run:

```bash
npm install
```

Make sure everything is correctly setup with:

```bash
npm test
```

We use Gulp tasks to lint, test and build this project. Please check
[dev-tasks](https://github.com/ehmicky/dev-tasks/blob/main/README.md) to learn
how to use them. You don't need to know Gulp to use these tasks.

# Requirements

Our coding style is documented
[here](https://github.com/ehmicky/eslint-config#coding-style). Linting and
formatting should automatically handle it though.

After submitting the pull request, please make sure the Continuous Integration
checks are passing.

We enforce 100% test coverage: each line of code must be tested.

New options, methods, properties, configuration and behavior must be documented
in all of these:

- the `README.md`
- the `docs` directory (if any)
- the `examples` directory (if any)

Please use the same style as the rest of the documentation and examples.
