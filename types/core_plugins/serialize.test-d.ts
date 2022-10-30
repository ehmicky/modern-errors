import type { ErrorObject } from 'error-serializer'
import { expectType, expectError } from 'tsd'

import modernErrors, { ErrorInstance } from '../main.js'
import plugin from './serialize.js'

const AnyError = modernErrors([plugin])
expectError(modernErrors([plugin], { serialize: undefined }))

const error = new AnyError('', { cause: '' })

const errorObject = error.toJSON()
expectType<ErrorObject>(errorObject)
expectError(error.toJSON(undefined))

expectType<ErrorInstance>(AnyError.parse(errorObject))
expectError(AnyError.parse({}))
expectError(AnyError.parse(errorObject, undefined))
