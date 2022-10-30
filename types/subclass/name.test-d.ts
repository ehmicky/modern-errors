import { expectType } from 'tsd'

import modernErrors from '../main.js'

const AnyError = modernErrors()
const ChildError = AnyError.subclass('ChildError')
const PluginAnyError = modernErrors([{ name: 'test' as const }])

expectType<never>(AnyError.subclass('AnyError'))
expectType<never>(ChildError.subclass('AnyError'))
expectType<never>(PluginAnyError.subclass('AnyError'))
