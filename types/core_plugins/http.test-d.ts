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

modernErrors([plugin], { http: { status: 200 } })
error.httpResponse({ status: 200 })
expectAssignable<Options>({ status: 200 })
expectError(modernErrors([plugin], { http: { status: true } }))
expectError(error.httpResponse({ status: true }))
expectNotAssignable<Options>({ status: true })

modernErrors([plugin], { http: { title: '' } })
error.httpResponse({ title: '' })
expectAssignable<Options>({ title: '' })
expectError(modernErrors([plugin], { http: { title: true } }))
expectError(error.httpResponse({ title: true }))
expectNotAssignable<Options>({ title: true })

modernErrors([plugin], { http: { detail: '' } })
error.httpResponse({ detail: '' })
expectAssignable<Options>({ detail: '' })
expectError(modernErrors([plugin], { http: { detail: true } }))
expectError(error.httpResponse({ detail: true }))
expectNotAssignable<Options>({ detail: true })

modernErrors([plugin], { http: { instance: '' } })
error.httpResponse({ instance: '' })
expectAssignable<Options>({ instance: '' })
expectError(modernErrors([plugin], { http: { instance: true } }))
expectError(error.httpResponse({ instance: true }))
expectNotAssignable<Options>({ instance: true })

modernErrors([plugin], { http: { stack: '' } })
error.httpResponse({ stack: '' })
expectAssignable<Options>({ stack: '' })
expectError(modernErrors([plugin], { http: { stack: true } }))
expectError(error.httpResponse({ stack: true }))
expectNotAssignable<Options>({ stack: true })

modernErrors([plugin], { http: { extra: {} } })
error.httpResponse({ extra: {} })
expectAssignable<Options>({ extra: {} })
modernErrors([plugin], { http: { extra: { prop: true } } })
error.httpResponse({ extra: { prop: true } })
expectAssignable<Options>({ extra: { prop: true } })
expectError(modernErrors([plugin], { http: { extra: true } }))
expectError(error.httpResponse({ extra: true }))
expectNotAssignable<Options>({ extra: true })

expectType<HttpResponse>(httpResponse)
expectType<string | undefined>(httpResponse.type)
expectType<number | undefined>(httpResponse.status)
expectType<string>(httpResponse.title)
expectType<string>(httpResponse.detail)
expectType<string | undefined>(httpResponse.instance)
expectType<string>(httpResponse.stack)
expectType<object | undefined>(httpResponse.extra)
expectError(httpResponse.extra?.prop)
