import test from 'ava'
import { each } from 'test-each'

import { ErrorClasses } from '../../helpers/main.js'
import { TEST_PLUGIN } from '../../helpers/plugin.js'

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`"props" are validated | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new ErrorClass('message', { props: true }))
  })

  test(`"props" are assigned | ${title}`, (t) => {
    t.true(new ErrorClass('message', { props: { prop: true } }).prop)
  })

  test(`"props" have priority over cause | ${title}`, (t) => {
    const cause = new ErrorClass('causeMessage', { props: { prop: false } })
    t.true(new ErrorClass('message', { cause, props: { prop: true } }).prop)
  })

  test(`"props" can be used even if cause has none | ${title}`, (t) => {
    const cause = new ErrorClass('causeMessage')
    t.true(new ErrorClass('message', { cause, props: { prop: true } }).prop)
  })

  test(`"props" are merged with cause' | ${title}`, (t) => {
    const propSym = Symbol('prop')
    const cause = new ErrorClass('causeMessage', {
      props: { one: true, [propSym]: true },
    })
    const error = new ErrorClass('message', { cause, props: { two: true } })
    t.true(error.one)
    t.true(error[propSym])
    t.true(error.two)
  })

  test(`"props" cannot override "message" | ${title}`, (t) => {
    const message = 'testMessage'
    const error = new ErrorClass('', { props: { message } })
    t.false(error.message.includes(message))
  })

  test(`"props" have less priority than other plugin.properties() | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', {
      plugins: [TEST_PLUGIN],
    })
    t.true(
      new TestError('message', {
        prop: { toSet: { prop: true } },
        props: { prop: false },
      }).prop,
    )
  })
})
