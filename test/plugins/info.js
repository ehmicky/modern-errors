import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from '../helpers/main.js'

const { TestError, UnknownError, AnyError } = defineClassOpts()

each(
  [
    () => new TestError('test').set,
    () => new TestError('test').getInstance(),
    () => AnyError.getProp(),
  ],
  ({ title }, getValues) => {
    test(`plugin.set|instanceMethods|staticMethods is passed AnyError | ${title}`, (t) => {
      t.is(getValues().AnyError, AnyError)
    })

    test(`plugin.set|instanceMethods|staticMethods is passed ErrorClasses | ${title}`, (t) => {
      t.deepEqual(getValues().ErrorClasses, { TestError, UnknownError })
    })

    test(`plugin.set|instanceMethods|staticMethods cannot modify ErrorClasses | ${title}`, (t) => {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      getValues().ErrorClasses.prop = true
      t.false('prop' in AnyError.getProp().ErrorClasses)
    })

    test(`plugin.set|instanceMethods|staticMethods cannot modify options | ${title}`, (t) => {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      getValues().options.prop = false
      t.is(AnyError.getProp().options.prop, undefined)
    })

    test(`plugin.set|instanceMethods|staticMethods has "full: true" with getOptions() | ${title}`, (t) => {
      t.true(getValues().options.full)
    })
  },
)
