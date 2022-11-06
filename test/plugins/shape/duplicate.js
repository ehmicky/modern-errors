import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../../helpers/main.js'

const { ErrorClasses } = getClasses()

const definePluginsSameClass = function (ErrorClass, pluginA, pluginB) {
  return ErrorClass.subclass.bind(undefined, 'TestError', {
    plugins: [pluginA, pluginB],
  })
}

const definePluginsSubClass = function (ErrorClass, pluginA, pluginB) {
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

    test(`plugin.staticMethods cannot be defined twice by different plugins | ${title}`, (t) => {
      t.throws(
        definePlugins(
          ErrorClass,
          { name: 'one', staticMethods: { one() {} } },
          { name: 'two', staticMethods: { one() {} } },
        ),
      )
    })

    test(`plugin.instanceMethods cannot be defined twice by different plugins | ${title}`, (t) => {
      t.throws(
        definePlugins(
          ErrorClass,
          { name: 'one', instanceMethods: { one() {} } },
          { name: 'two', instanceMethods: { one() {} } },
        ),
      )
    })
  },
)
