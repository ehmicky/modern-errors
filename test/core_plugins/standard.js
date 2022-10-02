import test from 'ava'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import STANDARD_PLUGIN from '../../src/core_plugins/standard.js'
import { defineClassOpts } from '../helpers/main.js'

const { TestError } = defineClassOpts({}, {}, [STANDARD_PLUGIN])
const testError = new TestError('test')

each(
  [
    true,
    { unknown: true },
    { title: true },
    { details: true },
    { stack: true },
    { status: '200' },
    { status: 600 },
    ...['type', 'instance'].flatMap((optName) => [
      { [optName]: true },
      { [optName]: '//' },
    ]),
    { extra: true },
  ],
  ({ title }, standard) => {
    test(`Options are validated | ${title}`, (t) => {
      t.throws(testError.toStandard.bind(testError, standard))
    })
  },
)

each(
  [
    ['title', 'testTitle'],
    ['details', 'testDetails'],
    ['stack', 'testStack'],
    // eslint-disable-next-line no-magic-numbers
    ['status', 200],
    ...['type', 'instance'].flatMap((optName) => [
      [optName, ''],
      [optName, '#hash'],
      [optName, '/path'],
      [optName, 'https://example.com/path'],
    ]),
    ['extra', {}],
    ['extra', { prop: true }],
  ],
  ({ title }, [propName, propValue]) => {
    test(`Valid options are kept | ${title}`, (t) => {
      t.deepEqual(
        testError.toStandard({ [propName]: propValue })[propName],
        propValue,
      )
    })
  },
)

each(
  [
    undefined,
    {},
    ...['title', 'details', 'status', 'type', 'instance', 'stack', 'extra'].map(
      (optName) => ({ [optName]: undefined }),
    ),
  ],
  ({ title }, standard) => {
    test(`Assign default options | ${title}`, (t) => {
      t.deepEqual(testError.toStandard(standard), {
        title: testError.name,
        details: testError.message,
        stack: testError.stack,
      })
    })
  },
)
