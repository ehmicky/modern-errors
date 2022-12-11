import test from 'ava'
import { each } from 'test-each'

import { ErrorClasses } from '../../helpers/main.test.js'

const definePluginsSameClass = (ErrorClass, pluginA, pluginB) =>
  ErrorClass.subclass.bind(undefined, 'TestError', {
    plugins: [pluginA, pluginB],
  })

const definePluginsSubClass = (ErrorClass, pluginA, pluginB) => {
  const TestError = ErrorClass.subclass('TestError', { plugins: [pluginA] })
  return TestError.subclass.bind(undefined, 'SubTestError', {
    plugins: [pluginB],
  })
}

each(
  ErrorClasses,
  [definePluginsSameClass, definePluginsSubClass],
  ({ title }, ErrorClass, definePlugins) => {
    test(`Cannot pass twice same plugins | ${title}`, (t) => {
      t.throws(definePlugins(ErrorClass, { name: 'one' }, { name: 'one' }))
    })
  },
)

each(
  ErrorClasses,
  [definePluginsSameClass, definePluginsSubClass],
  ['staticMethods', 'instanceMethods'],
  ['staticMethods', 'instanceMethods'],
  // eslint-disable-next-line max-params
  ({ title }, ErrorClass, definePlugins, methodTypeA, methodTypeB) => {
    test(`plugin methods cannot be defined twice by different plugins | ${title}`, (t) => {
      t.throws(
        definePlugins(
          ErrorClass,
          { name: 'one', [methodTypeA]: { one: () => {} } },
          { name: 'two', [methodTypeB]: { one: () => {} } },
        ),
      )
    })
  },
)

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`plugin.staticMethods and instanceMethods cannot share the same names | ${title}`, (t) => {
    t.throws(
      ErrorClass.subclass.bind(undefined, 'TestError', {
        plugins: [
          {
            name: 'one',
            staticMethods: { one: () => {} },
            instanceMethods: { one: () => {} },
          },
        ],
      }),
    )
  })
})
