import test from 'ava'
import { each } from 'test-each'

import { definePlugins, TEST_PLUGIN } from '../helpers/main.js'

each(
  [
    TEST_PLUGIN,
    [true],
    ...[undefined, true, '', 'testProp', 'test-prop', 'test_prop', '0test'].map(
      (name) => [{ ...TEST_PLUGIN, name }],
    ),
    ...['instanceMethods', 'staticMethods'].flatMap((propName) =>
      [true, { getProp: true }, { getProp: undefined }].map((methods) => [
        { ...TEST_PLUGIN, [propName]: methods },
      ]),
    ),
  ],
  ({ title }, plugins) => {
    test(`Should validate plugins | ${title}`, (t) => {
      t.throws(definePlugins.bind(undefined, plugins))
    })
  },
)

test('Should allow passing no plugins', (t) => {
  t.notThrows(definePlugins.bind(undefined, []))
})

test('Should allow valid plugins', (t) => {
  t.notThrows(definePlugins.bind(undefined, [TEST_PLUGIN]))
})

each(
  [
    { normalize: undefined },
    { set: undefined, unset: undefined },
    { instanceMethods: undefined },
    { staticMethods: undefined },
    { instanceMethods: {} },
    { staticMethods: {} },
  ],
  ({ title }, opts) => {
    test(`Should allow optional properties | ${title}`, (t) => {
      t.notThrows(definePlugins.bind(undefined, [{ ...TEST_PLUGIN, ...opts }]))
    })
  },
)

each(['normalize', 'set', 'unset'], ({ title }, propName) => {
  test(`Should validate functions | ${title}`, (t) => {
    t.throws(
      definePlugins.bind(undefined, [{ ...TEST_PLUGIN, [propName]: true }]),
    )
  })
})

each(['set', 'unset'], ({ title }, optName) => {
  test(`Should validate unset() without set() | ${title}`, (t) => {
    t.throws(
      definePlugins.bind(undefined, [{ ...TEST_PLUGIN, [optName]: undefined }]),
    )
  })
})
