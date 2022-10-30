import type { ErrorObject } from 'error-serializer'
import { expectType, expectError } from 'tsd'

import modernErrors, { ErrorInstance } from '../main.js'
import plugin from './serialize.js'

const AnyError = modernErrors([plugin])
const error = new AnyError('', { cause: '' })
const errorObject = error.toJSON()

expectError(modernErrors([plugin], { serialize: undefined }))
expectError(error.toJSON(undefined))
expectError(AnyError.parse(errorObject, undefined))

expectType<ErrorObject>(errorObject)

expectType<ErrorInstance>(AnyError.parse(errorObject))
expectError(AnyError.parse({}))
