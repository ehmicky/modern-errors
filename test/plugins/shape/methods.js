import test from 'ava'
import { each } from 'test-each'

import { ErrorClasses } from '../../helpers/main.js'
import { TEST_PLUGIN } from '../../helpers/plugin.js'

each(
  ErrorClasses,
  [true, { getProp: true }, { getProp: undefined }],
  ({ title }, ErrorClass, methods) => {
    test(`Should validate plugin.instanceMethods | ${title}`, (t) => {
      t.throws(
        ErrorClass.subclass.bind(undefined, 'TestError', {
          plugins: [{ ...TEST_PLUGIN, instanceMethods: methods }],
        }),
      )
    })

    test(`Should validate plugin.staticMethods | ${title}`, (t) => {
      t.throws(
        ErrorClass.subclass.bind(undefined, 'TestError', {
          plugins: [{ ...TEST_PLUGIN, staticMethods: methods }],
        }),
      )
    })
  },
)

each(
  ErrorClasses,
  [...Reflect.ownKeys(Error), 'normalize', 'subclass'],
  ({ title }, ErrorClass, propName) => {
    test(`plugin.staticMethods cannot redefine native Error.* | ${title}`, (t) => {
      t.throws(
        ErrorClass.subclass.bind(undefined, 'TestError', {
          plugins: [{ ...TEST_PLUGIN, staticMethods: { [propName]() {} } }],
        }),
      )
    })
  },
)

each(
  ErrorClasses,
  [
    ...new Set([
      ...Reflect.ownKeys(Error.prototype),
      ...Reflect.ownKeys(Object.prototype),
    ]),
  ],
  ({ title }, ErrorClass, propName) => {
    test(`plugin.instanceMethods cannot redefine native Error.prototype.* | ${title}`, (t) => {
      t.throws(
        ErrorClass.subclass.bind(undefined, 'TestError', {
          plugins: [{ ...TEST_PLUGIN, instanceMethods: { [propName]() {} } }],
        }),
      )
    })
  },
)