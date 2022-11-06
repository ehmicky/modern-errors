import test from 'ava'
import { each } from 'test-each'

import {
  getPropertiesInfo,
  getInstanceInfo,
  getStaticInfo,
} from '../../helpers/info.js'
import { getNativeErrors } from '../../helpers/known.js'
import { defineClassOpts } from '../../helpers/main.js'

const ErrorClasses = defineClassOpts()
const { TestError, AnyError } = ErrorClasses

each(
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  getNativeErrors(),
  ({ title }, getValues, getError) => {
    test(`errorInfo normalizes errors | ${title}`, (t) => {
      const { errorInfo } = getValues({ ErrorClasses })
      const { error } = errorInfo(getError())
      t.true(error instanceof AnyError)
    })
  },
)

each(
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  ({ title }, getValues) => {
    test(`errorInfo returns error | ${title}`, (t) => {
      const { errorInfo } = getValues({ ErrorClasses })
      t.true(errorInfo(new TestError('test')).error instanceof AnyError)
    })
  },
)

each(
  [(error) => error.properties, (error) => error.getInstance()],
  ({ title }, getSpecifics) => {
    test(`errorInfo can be applied on error itself | ${title}`, (t) => {
      const error = new TestError('test', { prop: true })
      const { errorInfo } = getSpecifics(error)
      const { options } = errorInfo(error)
      t.true(options.prop)
    })
  },
)
