import test from 'ava'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import BUGS_PLUGIN from '../../src/plugins_list/bugs.js'
import { defineSimpleClass } from '../helpers/main.js'

const { TestError, AnyError } = defineSimpleClass({}, [BUGS_PLUGIN])

const TEST_BUGS = import.meta.url
const TEST_BUGS_TWO = 'https://example.com/'
const TEST_MESSAGE = 'testMessage'

each([true, 'test', '//'], ({ title }, bugs) => {
  test(`bugs is validated | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new TestError('test', { bugs }))
  })
})

each([undefined, ''], ({ title }, bugs) => {
  test(`bugs is ignored if empty | ${title}`, (t) => {
    const { message } = new TestError(TEST_MESSAGE, { bugs })
    t.is(message, TEST_MESSAGE)
  })
})

test('bugs is shown in message', (t) => {
  const { message } = new TestError(TEST_MESSAGE, { bugs: TEST_BUGS })
  t.true(message.startsWith(TEST_MESSAGE))
  t.true(message.endsWith(TEST_BUGS))
})

test('bugs is reflected in stack', (t) => {
  const { stack } = new TestError(TEST_MESSAGE, { bugs: TEST_BUGS })
  t.true(stack.includes(TEST_BUGS))
})

test('bugs can be used by AnyError', (t) => {
  const { message } = new AnyError(TEST_MESSAGE, {
    cause: '',
    bugs: TEST_BUGS,
  })
  t.true(message.startsWith(TEST_MESSAGE))
  t.true(message.endsWith(TEST_BUGS))
})

test('bugs can be a URL', (t) => {
  const { message } = new TestError(TEST_MESSAGE, {
    bugs: new URL(TEST_BUGS),
  })
  t.true(message.startsWith(TEST_MESSAGE))
  t.true(message.endsWith(TEST_BUGS))
})

each(
  [TestError, AnyError],
  ['', 'causeMessage'],
  ['', TEST_MESSAGE],
  // eslint-disable-next-line max-params
  ({ title }, ErrorClass, causeMessage, parentMessage) => {
    test(`bugs is replaced with parent using defined value | ${title}`, (t) => {
      const cause = new TestError(causeMessage, { bugs: TEST_BUGS })
      const { message } = new ErrorClass(parentMessage, {
        cause,
        bugs: TEST_BUGS_TWO,
      })
      t.true(message.startsWith(causeMessage))
      t.true(message.includes(parentMessage))
      t.true(message.endsWith(TEST_BUGS_TWO))
      t.false(message.includes(TEST_BUGS))
    })
  },
)

each(
  ['', 'causeMessage'],
  ['', TEST_MESSAGE],
  ({ title }, causeMessage, parentMessage) => {
    test(`bugs is removed with known parent using undefined value | ${title}`, (t) => {
      const cause = new TestError(causeMessage, { bugs: TEST_BUGS })
      const { message } = new TestError(parentMessage, { cause })
      t.true(message.startsWith(causeMessage))
      t.true(message.includes(parentMessage))
      t.false(message.includes(TEST_BUGS))
    })

    test(`bugs is bumped with AnyError using undefined value | ${title}`, (t) => {
      const cause = new TestError(causeMessage, { bugs: TEST_BUGS })
      const { message } = new AnyError(parentMessage, { cause })
      t.true(message.startsWith(causeMessage))
      t.true(message.includes(parentMessage))
      t.true(message.endsWith(TEST_BUGS))
    })
  },
)
