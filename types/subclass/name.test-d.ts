import { expectType } from 'tsd'

import modernErrors from '../main.js'

const AnyError = modernErrors()
const SError = AnyError.subclass('SError')
const PAnyError = modernErrors([{ name: 'test' as const }])
const PSError = PAnyError.subclass('PSError')

expectType<never>(AnyError.subclass('AnyError'))
expectType<never>(PAnyError.subclass('AnyError'))
expectType<never>(SError.subclass('AnyError'))
expectType<never>(PSError.subclass('AnyError'))
