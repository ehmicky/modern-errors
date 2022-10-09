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
const { TestError, UnknownError } = ErrorClasses

each(
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  getNativeErrors(),
  ({ title }, getValues, getError) => {
    test(`errorInfo normalizes errors | ${title}`, (t) => {
      const { errorInfo } = getValues({ ErrorClasses })
      t.true(errorInfo(getError).unknownDeep)
    })
  },
)

each(
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  ({ title }, getValues) => {
    test(`errorInfo returns unknownDeep | ${title}`, (t) => {
      const { errorInfo } = getValues({ ErrorClasses })
      t.true(errorInfo(new UnknownError('test')).unknownDeep)
      t.false(errorInfo(new TestError('test')).unknownDeep)
    })
  },
)

each(
  [(error) => error.properties, (error) => error.getInstance()],
  ({ title }, getSpecifics) => {
    test(`errorInfo can be applied on error itself | ${title}`, (t) => {
      const error = new TestError('test', { prop: true })
      const { errorInfo } = getSpecifics(error)
      const { options, unknownDeep } = errorInfo(error)
      t.true(options.prop)
      t.false(unknownDeep)
    })
  },
)
