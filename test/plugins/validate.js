import test from 'ava'
import { each } from 'test-each'

import { defineGlobalOpts } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

test('Should allow valid plugins', (t) => {
  t.notThrows(defineGlobalOpts.bind(undefined, {}, [TEST_PLUGIN]))
})

test('Should allow passing no plugins', (t) => {
  t.notThrows(defineGlobalOpts.bind(undefined, {}, []))
})

each([TEST_PLUGIN, [true]], ({ title }, plugins) => {
  test(`Should validate plugins | ${title}`, (t) => {
    t.throws(defineGlobalOpts.bind(undefined, {}, plugins))
  })
})

each(
  [true, { getProp: true }, { getProp: undefined }],
  ({ title }, methods) => {
    test(`Should validate plugin.instanceMethods | ${title}`, (t) => {
      t.throws(
        defineGlobalOpts.bind(undefined, {}, [
          { ...TEST_PLUGIN, instanceMethods: methods },
        ]),
      )
    })

    test(`Should validate plugin.staticMethods | ${title}`, (t) => {
      t.throws(
        defineGlobalOpts.bind(undefined, {}, [
          { ...TEST_PLUGIN, staticMethods: methods },
        ]),
      )
    })
  },
)

each(
  [
    { isOptions: undefined },
    { getOptions: undefined },
    { set: undefined },
    { instanceMethods: undefined },
    { staticMethods: undefined },
    { instanceMethods: {} },
    { staticMethods: {} },
  ],
  ({ title }, opts) => {
    test(`Should allow optional properties | ${title}`, (t) => {
      t.notThrows(
        defineGlobalOpts.bind(undefined, {}, [{ ...TEST_PLUGIN, ...opts }]),
      )
    })
  },
)

each(['isOptions', 'getOptions', 'set'], ({ title }, propName) => {
  test(`Should validate functions | ${title}`, (t) => {
    t.throws(
      defineGlobalOpts.bind(undefined, {}, [
        { ...TEST_PLUGIN, [propName]: true },
      ]),
    )
  })
})
