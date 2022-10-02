import test from 'ava'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import HTTP_PLUGIN from '../../src/core_plugins/http.js'
import { defineClassOpts } from '../helpers/main.js'

const { TestError } = defineClassOpts({}, {}, [HTTP_PLUGIN])
const testError = new TestError('test')

each(
  [
    true,
    { unknown: true },
    { title: true },
    { detail: true },
    { stack: true },
    { status: '200' },
    { status: 600 },
    ...['type', 'instance'].flatMap((optName) => [
      { [optName]: true },
      { [optName]: '//' },
    ]),
    { extra: true },
  ],
  ({ title }, http) => {
    test(`Options are validated | ${title}`, (t) => {
      t.throws(testError.httpResponse.bind(testError, http))
    })
  },
)

each(
  [
    ['title', 'testTitle'],
    ['detail', 'testDetails'],
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
        testError.httpResponse({ [propName]: propValue })[propName],
        propValue,
      )
    })
  },
)

each(
  [
    undefined,
    {},
    ...['title', 'detail', 'status', 'type', 'instance', 'stack', 'extra'].map(
      (optName) => ({ [optName]: undefined }),
    ),
  ],
  ({ title }, http) => {
    test(`Assign default options | ${title}`, (t) => {
      t.deepEqual(testError.httpResponse(http), {
        title: testError.name,
        detail: testError.message,
        stack: testError.stack,
      })
    })
  },
)

test('Assign default extra', (t) => {
  const props = { prop: true }
  t.deepEqual(new TestError('test', { props }).httpResponse().extra, props)
})

test('Keep extra JSON-safe', (t) => {
  t.deepEqual(testError.httpResponse({ extra: { one: true, two: 0n } }).extra, {
    one: true,
  })
})

test('Keep object keys order', (t) => {
  t.deepEqual(
    Object.keys(
      testError.httpResponse({
        extra: {},
        stack: '',
        instance: '',
        type: '',
        status: 200,
        title: '',
        detail: '',
      }),
    ),
    ['type', 'status', 'title', 'detail', 'instance', 'stack', 'extra'],
  )
})
