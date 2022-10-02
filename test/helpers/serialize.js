import { runInNewContext } from 'vm'

// eslint-disable-next-line no-restricted-imports
import SERIALIZE_PLUGIN from '../../src/core_plugins/serialize.js'

import { defineClassOpts } from './main.js'

export const { TestError, AnyError, UnknownError } = defineClassOpts({}, {}, [
  SERIALIZE_PLUGIN,
])

export const testError = new TestError('message')
// eslint-disable-next-line fp/no-mutation
testError.one = true
export const errorObject = testError.toJSON()

export const nativeError = new TypeError('message')
// eslint-disable-next-line fp/no-mutation
nativeError.one = true

export const crossRealmError = new (runInNewContext('TypeError'))('message')

const parentNativeError = new TestError('test')
// eslint-disable-next-line fp/no-mutation
parentNativeError.prop = nativeError
export const nativeErrorObject = parentNativeError.toJSON().prop
