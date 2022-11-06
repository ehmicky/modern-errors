import test from 'ava'
import { each } from 'test-each'

import {
  getPropertiesInfo,
  getInstanceInfo,
  getStaticInfo,
} from '../../helpers/info.js'
import { getClasses } from '../../helpers/main.js'
import { TEST_PLUGIN } from '../../helpers/plugin.js'
import { getUnknownErrors } from '../../helpers/unknown.js'

const { ErrorSubclasses } = getClasses({ plugins: [TEST_PLUGIN] })

each(
  ErrorSubclasses,
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  getUnknownErrors(),
  // eslint-disable-next-line max-params
  ({ title }, ErrorClass, getValues, getUnknownError) => {
    test(`errorInfo throws on unknown errors | ${title}`, (t) => {
      const { errorInfo } = getValues(ErrorClass)
      t.throws(errorInfo.bind(undefined, getUnknownError()))
    })

    test(`errorInfo returns ErrorClass | ${title}`, (t) => {
      const { errorInfo } = getValues(ErrorClass)
      t.is(errorInfo(new ErrorClass('test')).ErrorClass, ErrorClass)
    })
  },
)

each(
  ErrorSubclasses,
  [(error) => error.properties, (error) => error.getInstance()],
  ({ title }, ErrorClass, getSpecifics) => {
    test(`errorInfo can be applied on error itself | ${title}`, (t) => {
      const error = new ErrorClass('test', { prop: true })
      const { errorInfo } = getSpecifics(error)
      t.true(errorInfo(error).options.prop)
    })
  },
)
