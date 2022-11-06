import test from 'ava'
import { each } from 'test-each'

import { KnownErrorClasses, SpecificErrorClasses } from '../helpers/known.js'

each(KnownErrorClasses, [undefined, {}], ({ title }, ErrorClass, opts) => {
  test(`Allows empty options | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.notThrows(() => new ErrorClass('test', opts))
  })
})

each(
  KnownErrorClasses,
  [null, '', { custom: true }],
  ({ title }, ErrorClass, opts) => {
    test(`Validate against invalid options | ${title}`, (t) => {
      // eslint-disable-next-line max-nested-callbacks
      t.throws(() => new ErrorClass('test', opts))
    })
  },
)
each(SpecificErrorClasses, ({ title }, ErrorClass) => {
  test(`Does not set options if not defined | ${title}`, (t) => {
    t.is(new ErrorClass('test').properties.options.prop, undefined)
  })

  test(`Sets options if defined | ${title}`, (t) => {
    t.true(new ErrorClass('test', { prop: true }).properties.options.prop)
  })

  test(`Parent instance options are merged shallowly | ${title}`, (t) => {
    const cause = new ErrorClass('causeMessage', {
      prop: { one: false, two: false, four: { five: false } },
    })
    t.deepEqual(
      new ErrorClass('test', {
        cause,
        prop: { two: true, three: true, four: { six: true } },
      }).properties.options.prop,
      { one: false, two: true, three: true, four: { six: true } },
    )
  })

  test(`plugin.properties() cannot modify "options" passed to instance methods | ${title}`, (t) => {
    const error = new ErrorClass('test', { prop: { one: true } })
    error.properties.options.prop.one = false
    t.true(error.getInstance().options.prop.one)
  })

  test(`Instance options have priority over class options | ${title}`, (t) => {
    const OtherAnyError = ErrorClass.subclass('TestError', { prop: false })
    const cause = new OtherAnyError('causeMessage')
    t.true(
      new OtherAnyError('test', { cause, prop: true }).properties.options.prop,
    )
  })

  test(`Undefined instance options are ignored | ${title}`, (t) => {
    const OtherAnyError = ErrorClass.subclass('TestError', { prop: true })
    const cause = new OtherAnyError('causeMessage')
    t.true(
      new OtherAnyError('test', { cause, prop: undefined }).properties.options
        .prop,
    )
  })

  test(`Not defined instance options are ignored | ${title}`, (t) => {
    const OtherAnyError = ErrorClass.subclass('TestError', { prop: true })
    const cause = new OtherAnyError('causeMessage')
    t.true(new OtherAnyError('test', { cause }).properties.options.prop)
  })
})

each(
  SpecificErrorClasses,
  [{ prop: false }, {}, undefined],
  ({ title }, ErrorClass, opts) => {
    test(`Parent errors options has priority over child | ${title}`, (t) => {
      const cause = new ErrorClass('causeMessage', opts)
      t.true(
        new ErrorClass('test', { cause, prop: true }).properties.options.prop,
      )
    })
  },
)

each(
  SpecificErrorClasses,
  SpecificErrorClasses,
  ({ title }, ErrorClass, ChildClass) => {
    test(`Child instance options are not unset | ${title}`, (t) => {
      const cause = new ChildClass('causeMessage', { prop: false })
      t.false(new ErrorClass('test', { cause }).properties.options.prop)
    })
  },
)
