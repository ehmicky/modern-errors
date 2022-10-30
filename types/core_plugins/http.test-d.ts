import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors from '../main.js'
import plugin, { Options, HttpResponse } from './http.js'

const AnyError = modernErrors([plugin])
const error = new AnyError('', { cause: '' })
const httpResponse = error.httpResponse()

modernErrors([plugin], { http: {} })
error.httpResponse({})
expectAssignable<Options>({})
expectError(error.httpResponse(undefined))
expectNotAssignable<Options>(undefined)
expectError(modernErrors([plugin], { http: true }))
expectError(error.httpResponse(true))
expectNotAssignable<Options>(true)
expectError(modernErrors([plugin], { http: { unknown: true } }))
expectError(error.httpResponse({ unknown: true }))
expectNotAssignable<Options>({ unknown: true })

modernErrors([plugin], { http: { type: '' } })
error.httpResponse({ type: '' })
expectAssignable<Options>({ type: '' })
expectError(modernErrors([plugin], { http: { type: true } }))
expectError(error.httpResponse({ type: true }))
expectNotAssignable<Options>({ type: true })

expectType<HttpResponse>(httpResponse)
